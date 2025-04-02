// Import dependencies
import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from '../middleware/error-handlers/validation-error';

// Mock the user service properly
jest.mock('../services/user.service', () => ({
  userService: {
    getOrCreateUser: jest.fn(),
    getAllUsers: jest.fn(),
    findUserById: jest.fn(),
  },
}));

// Mock Redis to prevent logging issues
jest.mock('../config/redis', () => ({
  redisClient: {
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
  },
  default: {
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// Import controller and mocked service after mocking
import { userController } from '../controllers/user.controller';
import { userService } from '../services/user.service';

describe('UserController', () => {
  let mockContext: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Koa context
    mockContext = {
      request: {
        body: {},
      },
      params: {},
      status: 0,
      body: null,
    };
  });

  describe('getOrCreateUser', () => {
    it('should return user when successful', async () => {
      const mockUser = {
        userId: uuidv4(),
        username: 'testuser',
        displayName: 'Test User',
      };

      mockContext.request.body = { username: 'testuser' };

      (userService.getOrCreateUser as jest.Mock).mockResolvedValueOnce(
        mockUser,
      );

      await userController.getOrCreateUser(mockContext);

      expect(mockContext.status).toBe(200);
      expect(mockContext.body).toEqual({
        userId: mockUser.userId,
        username: mockUser.username,
        displayName: mockUser.displayName,
      });
      expect(userService.getOrCreateUser).toHaveBeenCalledWith('testuser');
    });

    it('should handle validation error', async () => {
      mockContext.request.body = { username: '' };

      // Set up to throw validation error
      try {
        await userController.getOrCreateUser(mockContext);
      } catch (error: any) {
        expect(error).toBeInstanceOf(ValidationError);
        expect(error.message).toBe('Username is required');
      }

      // Service should not be called when validation fails
      expect(userService.getOrCreateUser).not.toHaveBeenCalled();
    });

    it('should handle server error', async () => {
      mockContext.request.body = { username: 'testuser' };

      const error = new Error('Database error');
      (userService.getOrCreateUser as jest.Mock).mockRejectedValueOnce(error);

      await userController.getOrCreateUser(mockContext);

      expect(mockContext.status).toBe(500);
      expect(mockContext.body).toEqual({
        message: 'Failed to process user request',
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { userId: uuidv4(), username: 'user1', displayName: 'User One' },
        { userId: uuidv4(), username: 'user2', displayName: 'User Two' },
      ];

      (userService.getAllUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

      await userController.getAllUsers(mockContext);

      expect(mockContext.status).toBe(200);
      expect(mockContext.body).toEqual({ users: mockUsers });
    });

    it('should handle errors', async () => {
      (userService.getAllUsers as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );

      await userController.getAllUsers(mockContext);

      expect(mockContext.status).toBe(500);
      expect(mockContext.body).toEqual({ message: 'Failed to fetch users' });
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const userId = uuidv4();
      const mockUser = {
        userId,
        username: 'testuser',
        displayName: 'Test User',
      };

      mockContext.params = { userId };
      (userService.findUserById as jest.Mock).mockResolvedValueOnce(mockUser);

      await userController.getUserById(mockContext);

      expect(mockContext.status).toBe(200);
      expect(mockContext.body).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      const userId = uuidv4();

      mockContext.params = { userId };
      (userService.findUserById as jest.Mock).mockResolvedValueOnce(null);

      await userController.getUserById(mockContext);

      expect(mockContext.status).toBe(404);
      expect(mockContext.body).toEqual({ message: 'User not found' });
    });

    it('should handle errors', async () => {
      mockContext.params = { userId: uuidv4() };
      (userService.findUserById as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );

      await userController.getUserById(mockContext);

      expect(mockContext.status).toBe(500);
      expect(mockContext.body).toEqual({ message: 'Failed to fetch user' });
    });
  });
});
