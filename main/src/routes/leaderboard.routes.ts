import Router from '@koa/router';
import { leaderboardController } from '../controllers';

const router = new Router({
  prefix: '/api/v1/leaderboard',
});

// Get leaderboard
router.get('/', leaderboardController.getLeaderboard);

export default router;
