const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) { req.value = {}; }
      req.value['body'] = result.value;
      next();
    }
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      userName: Joi.string(),
      profile_image: Joi.string()
    }),

    postSchema: Joi.object().keys({
      title: Joi.string().required(), // 뒤에 required를 붙여주면 필수 항목이라는 의미
      body: Joi.string().required(),
      tags: Joi.array().items(Joi.string()).required() // 문자열 배열
    })
  }
}