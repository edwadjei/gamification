import Router from '@koa/router';
import { elementController } from '../controllers';
import {
  elementSchema,
  rightAnswerSchema,
} from '../middleware/validators/schemas';
import { validateRequest } from '../middleware/validators/object-validator';

const router = new Router({
  prefix: '/api/v1/elements',
});

// Create a new element
router.post(
  '/',
  validateRequest(elementSchema),
  elementController.createElement,
);

// Set right answer for an element
router.put(
  '/:elementId/right-answer',
  validateRequest(rightAnswerSchema),
  elementController.setRightAnswer,
);

export default router;
