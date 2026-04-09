const { Router } = require('express');
const controller = require('../controllers/templateController');
const validators = require('../validators');
const validate = require('../middleware/validate');

const router = Router();

router
  .route('/')
  .get(validators.pagination, validate, controller.getAll)
  .post(validators.createTemplate, validate, controller.create);

router
  .route('/:id')
  .get(validators.getById, validate, controller.getById)
  .put(validators.updateTemplate, validate, controller.update)
  .delete(validators.getById, validate, controller.remove);

module.exports = router;
