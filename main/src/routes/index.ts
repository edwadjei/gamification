import Router from '@koa/router';
import userRoutes from './user.routes';
import elementRoutes from './element.routes';
import answerRoutes from './answer.routes';
import leaderboardRoutes from './leaderboard.routes';

export default [userRoutes, elementRoutes, answerRoutes, leaderboardRoutes];
