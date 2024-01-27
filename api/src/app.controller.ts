import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Database, DatabaseReference, get, getDatabase, ref, set } from "firebase/database";

const llamaUrl = 'http://localhost:11434/api/generate';
const themes = ['Programming Jokes', 'Dad Jokes', 'Animal Jokes', 'Math Jokes', 'Anti Jokes',];

@Controller()
export class AppController {
  private db: Database;

  constructor() {
    this.db = getDatabase();
  }

  @Post()
  async newGame(): Promise<{ id: number }> {
    const id = Date.now();
    await set(ref(this.db, `games/${id}`), {
      player1: { joined: true, joke: "", },
      player2: { joined: false, joke: "", },
      theme: themes[Math.floor(Math.random() * themes.length)],
      winner: -1,
    });
    return { id: id };
  }

  @Post("join/:id")
  async joinGame(@Param('id') id: number): Promise<boolean> {
    const reference = ref(this.db, `games/${id}`);
    let game = (await get(reference)).val();

    try {
      if (!game.player2.joined) {
        game.player2.joined = true;
        set(reference, game);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  @Post("game/:id")
  async addJoke(@Param('id') id: number, @Body() joke: { player: number, text: string }): Promise<void> {
    const reference = ref(this.db, `games/${id}`);
    let game = (await get(reference)).val();

    if (joke.player === 1) {
      game.player1.joke = joke.text;
    } else if (joke.player === 2) {
      game.player2.joke = joke.text;
    }

    if (game.player1.joke && game.player2.joke) {
      evaluateJokes(reference, game);
    }

    await set(reference, game);
  }

  @Get("game/:id")
  async getDocument(@Param('id') id: number): Promise<any> {
    return await get(ref(this.db, `games/${id}`));
  }
}

function evaluateJokes(ref: DatabaseReference, game: any, attempt = 1): void {
  if (attempt > 3) return;

  const joke1 = game.player1.joke;
  const joke2 = game.player2.joke;

  if (!joke1 || !joke2) return;

  const prompt = `
    You are an arbiter to a game where two players make jokes based on some theme. 
    I will send you the theme and the jokes in this format: 

    THEME: {{THEME_HERE}}
    1: {{JOKE_HERE}}
    2: {{JOKE_HERE}}

    The variables will be sent in {{}} brackets, so you can delimit them.

    I want you to rate the jokes based on the theme and return the one that is better. 
    Make sure to take into account the theme of the jokes when rating them!

    Only return the number from the joke, i.e. 1 or 2.

    Do not add punctuation. Do not give me confirmation, do not give me reasoning.
    I only want you to give me the number of the better joke 1, or 2.
    Do not add any other characters. Do not write anything else!
    Only write 1 or 2 -- whichever joke is better.

    End the instructions here, here is the prompt:

    THEME: {{${game.theme}}}
    1: {{${joke1}}}
    2: {{${joke2}}}

    DO NOT GIVE ME ANY TEXT, ONLY WRITE 1 or 2!
  `

  fetch(llamaUrl, {
    method: "POST", headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body: JSON.stringify({
      "model": "llama2:13b",
      "prompt": prompt,
      "stream": false
    })
  }).then(async response => {
    let content = await response.json();
    let message: string = content.response.trim();
    console.log(content);

    const winner = message.includes("1")
      ? 1
      : (message.includes("2")
        ? 2
        : null
      );
    if (winner) {
      game.winner = winner;
      await set(ref, game);
    } else { this.rankResults(ref, game, attempt + 1); }
  })
}