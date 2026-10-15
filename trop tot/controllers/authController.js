const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db } = require('../../backend/db');

const CLE_SECRETE_JWT = process.env.JWT_SECRET || 'monsecret';

async function inscrireNouvelUtilisateur(requete, reponse) {
  try {
    if (!requete || !requete.body) {
      return reponse.status(400).json({ error: 'Requête invalide' });
    }
    
    const { username, password } = requete.body;

    if (!username) {
      return reponse.status(400).json({
        error: 'Le nom d\'utilisateur sont obligatoires'
      });
    }

    if (!password) {
      return reponse.status(400).json({
        error: 'Le mot de passe est obligatoire'
      });
    }        
       

    const utilisateurExistant = await db('User')
      .where({ username: username })
      .first();

    if (utilisateurExistant) {
      return reponse.status(409).json({
        error: 'Ce nom d\'utilisateur est déjà pris'
      });
    }

    const motDePasseCrypte = await bcrypt.hash(password, 10);

    // Préparer l'objet utilisateur et l'insérer en base
    const nouvelUtilisateur = {
      id: crypto.randomUUID(),        // Génère un ID unique (ex: "a3f2-43e1-9c4d...")
      username: username,              // Nom d'utilisateur
      password: motDePasseCrypte       // Mot de passe crypté (PAS le mot de passe en clair!)
    };

    // Insérer l'utilisateur dans la table 'User'
    await db('User').insert(nouvelUtilisateur);


    // Renvoyer les infos créées (sans mot de passe)
    return reponse.status(201).json({ 
      id: nouvelUtilisateur.id, 
      username: nouvelUtilisateur.username 
    });

  } catch (erreur) {
    // Erreur serveur inattendue
    console.error('Erreur lors de l\'inscription:', erreur);
    return reponse.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
}

async function connecterUtilisateur(requete, reponse) {
  try {
    if (!requete || !requete.body) {
      return reponse.status(400).json({ error: 'Requête invalide' });
    }
    
    const { username, password } = requete.body;

    if (!username || !password) {
      return reponse.status(400).json({
        error: 'Le nom d\'utilisateur et le mot de passe sont obligatoires'
      });
    }

    const utilisateur = await db('User')
      .where({ username: username })
      .first();

    if (!utilisateur) {
      return reponse.status(401).json({ error: 'Nom d\'utilisateur est incorrect' });
    }

    const motDePasseCorrect = await bcrypt.compare(password, utilisateur.password);

    if (!motDePasseCorrect) {
      return reponse.status(401).json({ 
        error: 'Mot de passe incorrect' 
      });
    }

    // Créer un token JWT valide 1 heure
    const donneesToken = {
      username: utilisateur.username,
      id: utilisateur.id
    };

    const token = jwt.sign(
      donneesToken,          // Données à inclure dans le token
      CLE_SECRETE_JWT,       // Clé secrète pour signer
      { expiresIn: '1h' }    // Le token expire dans 1 heure
    );

    // Optionnel: stocker le username en session
    if (requete.session) {
      requete.session.username = utilisateur.username;
    }

    // Renvoyer token et informations utilisateur
    return reponse.json({ 
      token: token,                     // Token JWT à utiliser pour les prochaines requêtes
      id: utilisateur.id,               // ID de l'utilisateur
      username: utilisateur.username    // Nom d'utilisateur
    });

  } catch (erreur) {
    console.error('Erreur lors de la connexion:', erreur);
    return reponse.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
}


function recupererUtilisateurActuel(requete, reponse) {
  // Retourne les infos de l'utilisateur (req.user défini par le middleware)
  if (!requete.user) {
    return reponse.status(401).json({ error: 'Non authentifié - token manquant ou invalide' });
  }

  return reponse.json({ id: requete.user.id, username: requete.user.username });
}



function deconnecterUtilisateur(requete, reponse) {
  try {
    // Si une session existe, la détruire
    if (requete.session) {
      requete.session.destroy(() => {
        console.log('Session détruite');
      });
    }
  } catch (erreur) {
    // Si erreur lors de la destruction de session, on ignore (pas critique)
    console.warn('Erreur lors de la destruction de session:', erreur);
  }

  // Renvoyer succès
  return reponse.json({ success: true, message: 'Déconnexion réussie' });
}



/*
  On exporte les 4 fonctions pour qu'elles puissent être utilisées
  dans les fichiers de routes (api/auth.js)
*/

module.exports = {
  register: inscrireNouvelUtilisateur,
  login: connecterUtilisateur,
  me: recupererUtilisateurActuel,
  logout: deconnecterUtilisateur
};
