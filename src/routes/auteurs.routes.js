const router = require('express').Router();
const auteursController = require('../controllers/auteurs.controller');

const validateRequiredFields = require('../middlewares/validate.js');
router.get('/',auteursController.getAll);
router.get('/:id',auteursController.getOne);
router.post('/', validateRequiredFields(['nom']), auteursController.create);
router.put('/:id',auteursController.update);
router.delete('/:id',auteursController.delete);

module.exports = router;