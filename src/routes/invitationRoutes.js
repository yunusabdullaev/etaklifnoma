const { Router } = require('express');
const controller = require('../controllers/invitationController');
const validators = require('../validators');
const validate = require('../middleware/validate');

const router = Router();

router
  .route('/')
  .get(validators.pagination, validate, controller.getAll)
  .post(validators.createInvitation, validate, controller.create);

router
  .route('/:id')
  .get(validators.getById, validate, controller.getById)
  .put(validators.updateInvitation, validate, controller.update)
  .delete(validators.getById, validate, controller.remove);

module.exports = router;
