import { Context } from 'koa';
import { leaderboardService } from '../services';

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Leaderboard data
 */
export const leaderboardController = {
  /**
   * @swagger
   * /leaderboard:
   *   get:
   *     summary: Get leaderboard data
   *     tags: [Leaderboard]
   *     parameters:
   *       - in: query
   *         name: projectId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter by project ID
   *       - in: query
   *         name: eventId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter by event ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of results to return
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Number of results to skip
   *     responses:
   *       200:
   *         description: Leaderboard data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 leaderboard:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       userId:
   *                         type: string
   *                         format: uuid
   *                       totalScore:
   *                         type: number
   *                       rank:
   *                         type: number
   *       500:
   *         description: Server error
   */
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
