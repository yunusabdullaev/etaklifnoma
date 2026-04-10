const { Router } = require('express');
const controller = require('../controllers/invitationController');
const validators = require('../validators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

const router = Router();

router
  .route('/')
  .get(validators.pagination, validate, controller.getAll)
  .post(protect, validators.createInvitation, validate, controller.create);

// Must be before /:id route
router.get('/my', protect, controller.getMyInvitations);

router
  .route('/:id')
  .get(validators.getById, validate, controller.getById)
  .put(validators.updateInvitation, validate, controller.update)
  .delete(validators.getById, validate, controller.remove);

module.exports = router;
