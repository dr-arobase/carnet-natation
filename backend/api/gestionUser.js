const express = require("express");
const router = express.Router();
const path = require('path');
const crypto = require("crypto");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'monsecret';
const { db } = require("../db");

router.post('/addUser', async (req, res)=>{
   
   try{

    const {username, password} = req.body;

    if (!username || !password){
        return res.status(400).json({ error: "Champs obligatoires" });
      }
    if(!username){
        return res.status(400).json({error: "Champ 'username' obligatoire.."})
     }

    if(!password){
        return res.status(400).json({error: "Champ 'password' obligatoire.."})
     }
     
     const existingUser = await db("User").where({ username }).first();

     if (existingUser) {
        return res.status(400).json({error: "Ce nom d'utilisateur est déjà utilisé."})
     }

     const hashed = await bcrypt.hash(password, 10);

     const User = {
        id: crypto.randomUUID(),
        username: username,
        password: hashed,
        role: 'user'
     };

   await db("User").insert(User);
   // Renvoyer la réponse JSON au client (sans mot de passe)
   return res.status(201).json({ id: User.id, username: User.username, role: User.role });
    
     }catch(err){
      console.error("Erreur /addUser", err);
      res.status(500).json({error: "Erreur serveur.." })
     }    
});

router.get('/alluser', async (req, res)=>{
   try{
      const users = await db("User").select("*").orderBy("created_at", "desc");
      res.status(200).json(users)
   }catch(err){
      console.error("Erreur /alluser", err);
      res.status(500).json({error: "Erreur serveur.." })
   }
});



router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password){
            return res.status(400).json({ error: "Champs obligatoires" });
        }

        const user = await db("User").where({ username }).first();

        if (!user)
            return res.status(401).json({ error: "Utilisateur inconnu" });

        const match = await bcrypt.compare(password, user.password);
        if (!password || !match) 
         return res.status(401).json({ error: 'Mot de passe incorrect' });

      // Create a JWT token including the role
      const token = jwt.sign({ 
         id: user.id, 
         username: user.username, 
         role: user.role 
      }, 
         JWT_SECRET, { 
            expiresIn: '1h' 
         });
      // Renvoyer la réponse JSON au client; le frontend gère la redirection
      return res.json({
         message: "Connexion réussie",
         id: user.id,
         username: user.username,
         role: user.role,
         token
      });

      } catch (err) {
         console.error("Erreur /login", err);
         res.status(500).json({ error: 'Erreur serveur' });
      }
});



module.exports = router;