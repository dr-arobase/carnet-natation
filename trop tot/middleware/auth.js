// Middlewares JWT: strict (bloque) et optionnel (n'échoue pas)

const jwt = require('jsonwebtoken');

const CLE_SECRETE_JWT = process.env.JWT_SECRET || 'monsecret';


// Strict: bloque si header/token absent ou invalide

function authentificationStricte(requete, reponse, next) {
  // Lire le header Authorization (format: "Authorization: Bearer XXXXX")
  const headerAuthorization = requete.headers.authorization;
  
  console.log('[ Auth] Vérification du token:', headerAuthorization ? 'Présent' : 'Absent');

  // Si pas de token → bloquer
  if (!headerAuthorization) {
    console.log('[ Auth] Token manquant');
    return reponse.sendStatus(401);  // 401 = Unauthorized (Non authentifié)
  }

  // Extraire le token (prendre la partie après l'espace)
  const token = headerAuthorization.split(' ')[1];

  // Vérifier et décoder le token
  jwt.verify(token, CLE_SECRETE_JWT, (erreur, donneesToken) => {
    if (erreur) {
      // Token invalide (expiré, signature incorrecte, etc.)
      console.log('[ Auth] Token invalide:', erreur.message);
      return reponse.sendStatus(403);  // 403 = Forbidden (Interdit)
    }

    // Token valide → attacher les infos utilisateur à la requête
    console.log('[ Auth] Token valide pour:', donneesToken.username);
    requete.user = donneesToken;
    
    // Passer au middleware/contrôleur suivant
    return next();
  });
}

// Optionnel: attache req.user si token valide, sinon continue

function authentificationOptionnelle(requete, reponse, next) {
  const headerAuthorization = requete.headers.authorization;
  
  if (headerAuthorization) {
    console.log('[Auth optionnelle] Token détecté, vérification...');
  }

  // Si pas de token, continuer quand même (visiteur)
  if (!headerAuthorization) {
    return next();
  }

  // Extraire et vérifier le token
  const token = headerAuthorization.split(' ')[1];
  
  jwt.verify(token, CLE_SECRETE_JWT, (erreur, donneesToken) => {
    if (!erreur) {
      // Token valide → attacher les infos utilisateur
      console.log('[Auth optionnelle] Token valide pour:', donneesToken.username);
      requete.user = donneesToken;
    } else {
      // Token invalide → ignorer, continuer en mode visiteur
      console.log('[Auth optionnelle] Token invalide, continuation en mode visiteur');
    }
    
    // Dans TOUS LES CAS, continuer
    return next();
  });
}

module.exports = { 
  authenticateJWT: authentificationStricte,
  tryAuthenticateJWT: authentificationOptionnelle
};
