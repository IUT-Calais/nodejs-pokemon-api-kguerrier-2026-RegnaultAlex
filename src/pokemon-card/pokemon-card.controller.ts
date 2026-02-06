import type { Request, Response } from "express";
import prisma from "../client.js";
import { error } from "console";


export const getPokemonCards = async (_req: Request, res: Response) => {
    try 
    {
        const cards = await prisma.pokemonCard.findMany();
        if (!cards)
        {
            res.status(404).send({error: "Cartes non trouvées !"});
            return
        }
        res.status(200).send(cards);
    }
    catch (error)
    {
        res.status(500).send({error: "Erreur lors de l'obtention des cartes !"})
    }
}

export const getPokemonCard = async (req: Request, res: Response) => {
    try 
    {
        const {pokemonCardId} = req.params;
        if (pokemonCardId)
        {
            const card = await prisma.pokemonCard.findUnique({
                where: {
                    id: Number(pokemonCardId)
                }
            })

            if (!card)
            {
                res.status(404).send("Carte non trouvé !");
                return;
            }

            res.status(200).send(card);

        }
    }
    catch (error)
    {
        res.status(500).send({error: "Erreur lors de l'obtention de la carte !"})
    }
}

export const createPokemonCard = async (req: Request, res: Response) => {
    try 
    {

        const {name, pokedexId, typeId, lifePoints, size, weight, imageUrl} = req.body ;
        if (name === undefined || pokedexId === undefined || typeId === undefined || lifePoints === undefined)
        {
            res.status(404).send("Les valeurs name, pokedexId, typeId et lifePoints sont requis")
            return;
        }


        if (!await prisma.type.findUnique({
            where : {
                id: Number(typeId)
            }
        }))
        {
            res.status(404).send({error: "Le TypeId n'existe pas !"});
            return;
        }
        else if (await prisma.pokemonCard.findUnique({
            where: {
                name: name
            }
        }))
        {
            res.status(404).send({error: "Le nom de pokemon existe déjà !"});
            return;
        }
        else if (await prisma.pokemonCard.findUnique({
            where :{
                pokedexId: pokedexId
            }
        }))
        {
            res.status(404).send({error: "Le pokedexId existe déjà !"});
            return;
        }

        res.status(201).send(
            await prisma.pokemonCard.create({
                data: {
                    name,
                    pokedexId,
                    typeId,
                    lifePoints,
                    size,
                    weight,
                    imageUrl
                }
            })
        )
    }
    catch (error)
    {
        res.status(500).send({error: "Erreur lors de la création de la carte !"});
        console.log(error)
    }
}

export const editPokemonCard = async (req: Request, res: Response) => {

    try 
    {
        const {pokemonCardId} = req.params;
        const {name, pokedexId, typeId, lifePoints, size, weight, imageUrl} = req.body;



        if (!await prisma.pokemonCard.findUnique({
            where: {
                id: Number(pokemonCardId)
            }
        }))
        {
            res.status(400).send({error: "Le pokemonCardId n'existe pas !"});
            return;
        }

        // Check si le pokedex existe
        else if (pokedexId && await prisma.pokemonCard.findUnique({
            where: {
                pokedexId: Number(pokedexId)
            }
        }))
        {
            res.status(400).send({error: "Le pokedexId existe déjà !"});
            return;
        }

        // Check si le le nouveau nom existe
        else if (name && await prisma.pokemonCard.findUnique({
            where: {
                name: name
            }
        }))
        {
            res.status(400).send({error: "Le nom existe déjà !"});
            return;
        }
        
        // Check si le nouveau type existe
        else if (typeId && !await prisma.type.findUnique({
            where: {
                id: Number(typeId)
            }
        }))
        {
            res.status(400).send({error: "Le typeId n'existe pas"});
            return;
        }


        res.status(200).send(await prisma.pokemonCard.update({
            where: {
                id: Number(pokemonCardId)
            },
            data: {
                name, 
                pokedexId, 
                typeId, 
                lifePoints, 
                size, 
                weight, 
                imageUrl
            }
        }));



    }
    catch (error)
    {
        res.status(500).send({error: "Erreur lors de la modification de la carte !"});
        console.log(error)
    }
}


export const deletePokemonCard = async (req: Request, res: Response) => {

    try
    {

        const {pokemonCardId} = req.params

        if (!await prisma.pokemonCard.findUnique({
                where: {
                    id: Number(pokemonCardId)
                }
            }))
        {
            res.status(404).send("Le pokemonCardId n'existe pas !");
        }

        res.status(204).send(await prisma.pokemonCard.delete({
            where: {
                id: Number(pokemonCardId)
            }
        }))
    }
    catch (error)
    {
        res.status(500).send({error: "Erreur lors de la suppression de la carte !"});
        console.log(error)
    }

}