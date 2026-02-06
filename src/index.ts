import express from 'express';
import { pokemonCardRouter } from './pokemon-card/pokemon-card.router';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const server = app.listen(port);

app.use("/pokemons-cards", pokemonCardRouter)

export function stopServer() {
  server.close();
}
