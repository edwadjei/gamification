import { Context } from 'koa';
import { userService } from '../services';
import { ValidationError } from '../middleware/error-handlers/validation-error';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

export const userController = {
  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Get or create a user by username
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *             properties:
   *               username:
   *                 type: string
   *                 example: "john_doe"
   *     responses:
   *       200:
   *         description: User created or retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 userId:
   *                   type: string
   *                   format: uuid
   *                 username:
   *                   type: string
   *                 displayName:
   *                   type: string
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       userId:
   *                         type: string
   *                         format: uuid
   *                       username:
   *                         type: string
   *                       displayName:
   *                         type: string
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /users/{userId}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: User's unique ID
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */
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
