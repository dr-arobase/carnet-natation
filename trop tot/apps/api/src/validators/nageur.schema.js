// simple validation skeleton
const Joi = require('joi');

const createSchema = Joi.object({
  nom: Joi.string().required(),
  niveau: Joi.string().allow('', null),
  horaire: Joi.string().allow('', null),
  session: Joi.string().allow('', null),
  commentaires: Joi.string().allow('', null),
});

module.exports = { createSchema };
