import { AppDataSource } from '../config/db';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from '../middleware/error-handlers/validation-error';

export const userService = {
  async findUserByUsername(username: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({ where: { username } });
  },

  async findUserById(userId: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({ where: { userId } });
  },

  async getOrCreateUser(username: string): Promise<User> {
    // Additional validation
    if (!username || typeof username !== 'string') {
      throw new ValidationError('Username is required');
    }

    if (username.length < 3) {
      throw new ValidationError('Username must be at least 3 characters long');
    }

    if (username.length > 30) {
      throw new ValidationError('Username cannot exceed 30 characters');
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9_\-.]+$/.test(username)) {
      throw new ValidationError(
        'Username can only contain letters, numbers, underscores, hyphens, and periods',
      );
    }

    // Normalize username (trim, lowercase)
    const normalizedUsername = username.trim().toLowerCase();

    const userRepository = AppDataSource.getRepository(User);

    // Check if user exists
    let user = await this.findUserByUsername(normalizedUsername);

    // If user doesn't exist, create a new one
    if (!user) {
      user = new User();
      user.userId = uuidv4();
      user.username = normalizedUsername;
      user.displayName = username.trim(); // Preserve original casing for display

      await userRepository.save(user);
      console.log(`Created new user: ${user.username} (${user.userId})`);
    }

    return user;
  },

  async getAllUsers(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.find({
      order: {
        username: 'ASC',
      },
    });
  },
};
