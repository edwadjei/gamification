import { AppDataSource } from '../config/db';
import { Score } from '../models/score';
import { redisClient } from '../config/redis';

interface LeaderboardOptions {
  projectId?: string;
  eventId?: string;
  limit?: number;
  offset?: number;
}

interface LeaderboardEntry {
  userId: string;
  totalScore: number;
  rank: number;
}

export const leaderboardService = {
  async getLeaderboard(
    options: LeaderboardOptions = {},
  ): Promise<LeaderboardEntry[]> {
    const { projectId, eventId, limit = 10, offset = 0 } = options;

    // Create cache key
    const cacheKey = `leaderboard:${projectId || 'all'}:${
      eventId || 'all'
    }:${limit}:${offset}`;

    // Try to get from cache first
    try {
      const cachedLeaderboard = await redisClient.get(cacheKey);
      if (cachedLeaderboard?.length) {
        console.log('Returning leaderboard from cache');
        return JSON.parse(cachedLeaderboard);
      }
    } catch (error) {
      console.error('Redis cache error:', error);
      // Continue to database query if cache fails
    }

    // If not in cache, query database
    const scoreRepository = AppDataSource.getRepository(Score);

    let queryBuilder = scoreRepository
      .createQueryBuilder('score')
      .select('score.userId', 'userId')
      .addSelect('SUM(score.totalScore)', 'totalScore')
      .groupBy('score.userId')
      .orderBy('totalScore', 'DESC')
      .limit(limit)
      .offset(offset);

    if (projectId) {
      queryBuilder = queryBuilder.andWhere('score.projectId = :projectId', {
        projectId,
      });
    }

    if (eventId) {
      queryBuilder = queryBuilder.andWhere('score.eventId = :eventId', {
        eventId,
      });
    }

    const leaderboardData = await queryBuilder.getRawMany();

    // Format and add ranking
    const leaderboard = leaderboardData.map((entry, index) => ({
      userId: entry.userId,
      totalScore: parseInt(entry.totalScore, 10),
      rank: offset + index + 1,
    }));

    // Cache the result
    try {
      await redisClient.set(
        cacheKey,
        JSON.stringify(leaderboard),
        'EX',
        3600, // 1 hour expiration
      );
    } catch (error) {
      console.error('Redis cache set error:', error);
      // Continue even if caching fails
    }

    return leaderboard;
  },
};
