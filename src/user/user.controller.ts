import type { Request, Response } from "express";
import bcrypt from 'bcrypt'
import prisma from "../client";
import jwt from 'jsonwebtoken'

export const createUser = async (req: Request, res : Response) =>
{

    try
    {
        const {email, password} = req.body;
        
        if (!email || !password)
        {
            res.status(400).send({error: "Un email et un mot de passe sont requis !"});
            return;
        }
        
        
        // Check si l'email existe
        if (await prisma.user.findUnique({
            where: {
                email: email
            }
        }))
        {
            res.status(400).send({ error: "Cet email existe déjà !"});
            return;
        }

        let encryptedPassword = await bcrypt.hash(password, 10);

        res.status(201).send(await prisma.user.create({
            data: {
                email: email,
                password: encryptedPassword
            }
        }))

    }
    catch (error)
    {
        console.error('Erreur lors de la connexion:', error)
        res.status(500).send("Erreur lors de la création de l'utilisateur !");
        return;
    }

}

export const loginUser = async (req: Request, res: Response) => {

    try
    {
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user)
        {
            res.status(401).send({error: 'Email ou mot de passe incorrect'});
            return;
        }


        if (!await bcrypt.compare(password, user.password))
        {
            res.status(401).send({error: 'Email ou mot de passe incorrect'});
            return;
        }
        else
        {
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: process.env.JWT_EXPIRES_IN as any}
            )


            res.status(200).send({
                message: 'Connexion réussie',
                token,
                user: {
                id: user.id,
                email: user.email,
                },
            })
            return
        }

    }
    catch(error)
    {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
        return;
    }


            
}