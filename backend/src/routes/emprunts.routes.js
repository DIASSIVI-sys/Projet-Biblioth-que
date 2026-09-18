const router = require('express').Router();
const empruntsController = require('../controllers/emprunts.controller');

const validateRequiredFields = require('../middlewares/validate.js');
router.get('/en-cours',empruntsController.getEmpruntsEnCours);
router.get('/en-retard',empruntsController.getEmpruntsEnRetards);
router.post('/', validateRequiredFields(['id_adherent', 'id_livre',"date_retour_prevue"]), empruntsController.create);
router.put('/:id/retour',empruntsController.retour);
//GET Api/emprunts


module.exports=router;