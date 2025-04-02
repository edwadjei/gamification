import Router from '@koa/router';
import { userController } from '../controllers';

const router = new Router({
  prefix: '/api/v1/users',
});

// Get or create user
router.post('/login', userController.getOrCreateUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:userId', userController.getUserById);

export default router;
