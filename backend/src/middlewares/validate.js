const validateRequiredFields = (fields) => {
    return (req, res, next) => {
        for (const field of fields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Le champ ${field} est requis` });
            }
        }
        next();
    };
};

module.exports = validateRequiredFields ;