const { Router } = require('express');
const controller = require('../controllers/eventTypeController');
const validators = require('../validators');
const validate = require('../middleware/validate');

const router = Router();

router
  .route('/')
  .get(controller.getAll)
  .post(validators.createEventType, validate, controller.create);

router
  .route('/:id')
  .get(validators.getById, validate, controller.getById)
  .put(validators.updateEventType, validate, controller.update)
  .delete(validators.getById, validate, controller.remove);

module.exports = router;
