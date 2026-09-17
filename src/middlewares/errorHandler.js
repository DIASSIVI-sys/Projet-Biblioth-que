const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    //ereur de contrainte de clé étrangère
    if (err.code === '23503') {
        return res.status(400).json({ message: 'Impossible cet élement est référencé par un autre élement' });
    }
    //erreur de contrainte CHECK ou NOT NULL
    if (err.code === '23514' || err.code === '23502') {
        return res.status(400).json({ message: 'Données invalides' });
    }
    //erreur par défaut
    res.status(500).json({ message: 'Erreur serveur' });
};

module.exports = errorHandler;