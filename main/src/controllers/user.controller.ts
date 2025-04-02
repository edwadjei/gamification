import { Context } from 'koa';
import { userService } from '../services/user.service';
import { ValidationError } from '../middleware/error-handlers/validation-error';

export const userController = {
  async getOrCreateUser(ctx: Context): Promise<void> {
    const { username } = ctx.request.body as { username: string };

    try {
      // Validate username
      if (!username || typeof username !== 'string' || username.trim() === '') {
        throw new ValidationError('Username is required');
      }

      const user = await userService.getOrCreateUser(username);

      ctx.status = 200;
      ctx.body = {
        userId: user.userId,
        username: user.username,
        displayName: user.displayName,
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      } else {
        console.error('Error getting or creating user:', error);
        ctx.status = 500;
        ctx.body = { message: 'Failed to process user request' };
      }
    }
  },

  async getAllUsers(ctx: Context): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      ctx.status = 200;
      ctx.body = {
        users: users.map((user) => ({
          userId: user.userId,
          username: user.username,
          displayName: user.displayName,
        })),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to fetch users' };
    }
  },

  async getUserById(ctx: Context): Promise<void> {
    const { userId } = ctx.params;

    try {
      const user = await userService.findUserById(userId);

      if (!user) {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
        return;
      }

      ctx.status = 200;
      ctx.body = {
        userId: user.userId,
        username: user.username,
        displayName: user.displayName,
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to fetch user' };
    }
  },
};
