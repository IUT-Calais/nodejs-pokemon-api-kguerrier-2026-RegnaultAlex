import { Router } from "express";
import { createPokemonCard, deletePokemonCard, editPokemonCard, getPokemonCard, getPokemonCards } from "./pokemon-card.controller";

export const pokemonCardRouter = Router()


pokemonCardRouter.get("/", getPokemonCards);
pokemonCardRouter.get("/:pokemonCardId", getPokemonCard);
pokemonCardRouter.post("/", createPokemonCard)
pokemonCardRouter.patch("/:pokemonCardId", editPokemonCard)
pokemonCardRouter.delete("/:pokemonCardId", deletePokemonCard);
