const Joi = require('joi');

const BagDTO = Joi.object({
  type: Joi.string().valid('Doce', 'Salgada', 'Mista').required(),
  price: Joi.number().required(),
  description: Joi.string().allow(null, ''),
  status: Joi.number().integer().valid(0, 1).default(1),
  tags: Joi.array().items(Joi.string()).allow(null),
  createdAt: Joi.date().iso().default(() => new Date()),
  updatedAt: Joi.date().iso().default(() => new Date())
});

module.exports = BagDTO; 