class Nageur {
  constructor({ id, nom, niveau, horaire, session, commentaires, created_at }){
    this.id = id;
    this.nom = nom;
    this.niveau = niveau;
    this.horaire = horaire;
    this.session = session;
    this.commentaires = commentaires;
    this.created_at = created_at;
  }
}

module.exports = Nageur;
