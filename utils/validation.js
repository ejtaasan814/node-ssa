const { check, body, validationResult } = require('express-validator');


const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return 'true';
    }
    let err = errors.errors[0].msg
    res.status(400).json({ err });
    return 'false';
  };
};


module.exports = { validate, body }