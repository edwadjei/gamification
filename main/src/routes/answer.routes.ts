import Router from '@koa/router';
import { answerController } from '../controllers';
import { validateRequest } from '../middleware/validators/object-validator';
import { userAnswerSchema } from '../middleware/validators/schemas';

const router = new Router({
  prefix: '/api/v1/user-answers',
});

// Submit a user answer
router.post(
  '/',
  validateRequest(userAnswerSchema),
  answerController.submitUserAnswer,
);

export default router;
