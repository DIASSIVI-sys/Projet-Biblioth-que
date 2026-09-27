const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      const valeur = req.body[field];
      if (valeur === undefined || valeur === null || valeur === '') {
        return res.status(400).json({ message: `Le champ "${field}" est obligatoire` });
      }
    }
    next();
  };
};

module.exports = validateRequiredFields;