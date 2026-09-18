const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// 1. D'abord, le middleware pour lire le JSON
app.use(express.json());
app.use(cors());
app.use(logger);

// 2. Ensuite, on importe la route et on l'utilise
const auteursRoutes = require('./routes/auteurs.routes');
app.use('/api/auteurs', auteursRoutes);

const adherentsRoutes =require('./routes/adherents.routes');
app.use('/api/adherents',adherentsRoutes);

const livresRoutes =require('./routes/livres.routes');
app.use('/api/livres',livresRoutes);

const empruntsRoutes =require('./routes/emprunts.routes');
app.use('/api/emprunts',empruntsRoutes);

const statsRoutes = require('./routes/stats.routes');
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

module.exports = app;