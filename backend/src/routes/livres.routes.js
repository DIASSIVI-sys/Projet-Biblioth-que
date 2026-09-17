const router =require('express').Router();
const livresController = require('../controllers/livres.controller');

const validateRequiredFields = require('../middlewares/validate.js');
//GET Api/livres
router.get('/',livresController.getAll);
router.get('/:id',livresController.getOne);
router.post('/', validateRequiredFields(['titre','id_auteur']), livresController.create);
router.put('/:id',livresController.update);
router.delete('/:id',livresController.delete);

module.exports = router;