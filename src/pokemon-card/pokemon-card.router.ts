import { Router } from "express";
import { createPokemonCard, deletePokemonCard, editPokemonCard, getPokemonCard, getPokemonCards } from "./pokemon-card.controller";
import { verifyJWT } from "./pokemon-card.middleware";

export const pokemonCardRouter = Router()


pokemonCardRouter.get("/", getPokemonCards);
pokemonCardRouter.get("/:pokemonCardId", getPokemonCard);
pokemonCardRouter.post("/", verifyJWT, createPokemonCard)
pokemonCardRouter.patch("/:pokemonCardId", verifyJWT, editPokemonCard)
pokemonCardRouter.delete("/:pokemonCardId", verifyJWT, deletePokemonCard);
