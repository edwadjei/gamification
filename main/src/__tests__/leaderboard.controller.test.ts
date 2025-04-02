// Mock dependencies first
jest.mock('../services/leaderboard.service', () => ({
  leaderboardService: {
    getLeaderboard: jest.fn(),
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

// Import after mocking
import { leaderboardController } from '../controllers/leaderboard.controller';
import { leaderboardService } from '../services/leaderboard.service';
import { v4 as uuidv4 } from 'uuid';

describe('LeaderboardController', () => {
  let mockContext: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock Koa context
    mockContext = {
      query: {},
      status: 0,
      body: null,
    };
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard with default parameters', async () => {
      const mockLeaderboard = [
        { userId: uuidv4(), totalScore: 150, rank: 1 },
        { userId: uuidv4(), totalScore: 120, rank: 2 },
      ];

      (leaderboardService.getLeaderboard as jest.Mock).mockResolvedValueOnce(
        mockLeaderboard,
      );

      await leaderboardController.getLeaderboard(mockContext);

      expect(mockContext.status).toBe(200);
      expect(mockContext.body).toEqual({ leaderboard: mockLeaderboard });
      expect(leaderboardService.getLeaderboard).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
    });

    it('should pass query parameters to service', async () => {
      const projectId = uuidv4();
      const eventId = uuidv4();
      mockContext.query = {
        projectId,
        eventId,
        limit: '5',
        offset: '10',
      };

      const mockLeaderboard = [
        { userId: uuidv4(), totalScore: 150, rank: 11 },
        { userId: uuidv4(), totalScore: 120, rank: 12 },
      ];

      (leaderboardService.getLeaderboard as jest.Mock).mockResolvedValueOnce(
        mockLeaderboard,
      );

      await leaderboardController.getLeaderboard(mockContext);

      expect(mockContext.status).toBe(200);
      expect(mockContext.body).toEqual({ leaderboard: mockLeaderboard });
      expect(leaderboardService.getLeaderboard).toHaveBeenCalledWith({
        projectId,
        eventId,
        limit: 5,
        offset: 10,
      });
    });

    it('should handle service errors', async () => {
      (leaderboardService.getLeaderboard as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );

      await leaderboardController.getLeaderboard(mockContext);

      expect(mockContext.status).toBe(500);
      expect(mockContext.body).toEqual({
        message: 'Failed to fetch leaderboard',
      });
    });
  });
});
