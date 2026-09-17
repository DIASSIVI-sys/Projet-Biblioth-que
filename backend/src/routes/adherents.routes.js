const router = require('express').Router();
const adherentsController = require('../controllers/adherents.controller');

const validateRequiredFields = require('../middlewares/validate.js'); 

//GET Api/adherents
router.get('/',adherentsController.getAll);
router.get('/:id',adherentsController.getOne);
//GET Api/adherents/:id/emprunts
router.get('/:id/emprunts',adherentsController.getEmprunts);

//POST Api/adherents
router.post('/', validateRequiredFields(['nom']), adherentsController.create);

//PUT Api/adherents/:id
router.put('/:id',adherentsController.update);

//DELETE Api/adherents/:id
router.delete('/:id',adherentsController.delete);

module.exports = router;

