const express = require("express");
const crypto = require('crypto');

const router = express.Router();

const { db } = require("../db");

router.post('/addNageurs', async (req, res) => {
    try {
        const { nom, prenom, niveau, horaire, notes } = req.body;

        if (!(nom)) {
            return res.status(400).json({ error: "Le champ 'nom' est obligatoire." });
        }
        if (!(prenom)) {
            return res.status(400).json({ error: "Le champ 'prenom' est obligatoire." });
        }
        if (!niveau) {
            return res.status(400).json({ error: "Le champ 'niveau' est obligatoire." });
        }
        if (!horaire) {
            return res.status(400).json({ error: "Le champ 'horaire' est obligatoire." });
        }
        const nageur = {
            id: crypto.randomUUID(),
            nom: nom,
            prenom: prenom,
            niveau: niveau,
            horaire: horaire,
            notes: notes || null
        };
        await db('nageurs').insert(nageur);
        res.status(201).json(nageur);
    } catch (err) {
        console.error("Erreur /addNageur", err);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

router.get('/allNageurs', async (req, res)=>{
    try{
        const nageurs = await db('nageurs')
            .select('*')
            .orderBy('created_at', 'desc');
        
        res.status(200).json(nageurs);
    }catch(err){
        console.error("Erreur /allNageurs", err);
        res.status(500).json({error: "Erreur serveur.." });
    }
});

router.put('/updateNageurs/:id', async (req, res) => {
    try {
        const {id} = req.params;
        console.log('PUT /updateNageurs', { 
            id, 
            body: req.body 
        });
        const { 
            nom, 
            prenom, 
            niveau, 
            horaire, 
            notes
        } = req.body;

        const nageurToUpdate = {};

        if (!(nom)) {
            return res.status(400).json({ error: "Le champ 'nom' est obligatoire." });
        }
        if (!(prenom)) {
            return res.status(400).json({ error: "Le champ 'prenom' est obligatoire." });
        }
        if (!niveau) {
            return res.status(400).json({ error: "Le champ 'niveau' est obligatoire." });
        }
        if (!horaire) {
            return res.status(400).json({ error: "Le champ 'horaire' est obligatoire." });
        }
    nageurToUpdate.nom = nom;
    nageurToUpdate.prenom = prenom;
    nageurToUpdate.niveau = niveau;
    nageurToUpdate.horaire = horaire;
    nageurToUpdate.notes = notes;

    const  updated = await db("nageurs").where({id}).update(nageurToUpdate);
    if (updated == 0) {
     return res.status(404).json({error: "Nageur introuvable.."})
    }
    const updatedNageur = await db('nageurs').where({id}).first();
    res.status(200).json(updatedNageur);


   }catch(err){
      console.error("Erreur /updateNageur", err);
      res.status(500).json({error: "Erreur serveur.." })

     }
      

});
router.delete('/deleteNageurs/:id', async (req, res) => {
    try{

     const {id} = req.params;
    console.log('DELETE /deleteNageurs', { id });

     const deleted = await db("nageurs").where({id}).del();
      
     if (deleted ==0){
     return res.status(404).json({error: "Nageur introuvable.."})
    }
    res.status(200).json({message: "Nageur supprime...", id});
    
    }catch(err){
     console.error("Erreur /deleteNageur", err);
     res.status(500).json({error: "Erreur serveur.." })

    }

});

module.exports = router;