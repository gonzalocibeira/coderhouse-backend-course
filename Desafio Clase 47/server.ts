import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";

function reversePhrase(phrase: string) {
    return phrase.split('').reverse().join('');
  }

const app = new Application();
const router = new Router();

router.get('/', (ctx: Context) => {
    const phrase = ctx.request.url.searchParams.get('phrase') ?? '';
    const reversed = reversePhrase(phrase);
    ctx.response.body = reversed;
  });

app.use(router.routes());

app.listen({ port: 3000 });

console.log("Server listening port 3000");