import { Context } from 'koa';
import { leaderboardService } from '../services/leaderboard.service';

export const leaderboardController = {
  async getLeaderboard(ctx: Context): Promise<void> {
    const projectId = ctx.query.projectId as string | undefined;
    const eventId = ctx.query.eventId as string | undefined;
    const limit = ctx.query.limit ? parseInt(ctx.query.limit as string) : 10;
    const offset = ctx.query.offset ? parseInt(ctx.query.offset as string) : 0;

    try {
      const leaderboard = await leaderboardService.getLeaderboard({
        projectId,
        eventId,
        limit,
        offset,
      });

      ctx.status = 200;
      ctx.body = { leaderboard };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to fetch leaderboard' };
    }
  },
};
