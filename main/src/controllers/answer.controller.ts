import { Context } from 'koa';
import { ValidationError } from '../middleware/error-handlers/validation-error';
import { answerService } from '../services';

export const answerController = {
  async submitUserAnswer(ctx: Context): Promise<void> {
    const { userId, elementId, userAnswer } = ctx.request.body as {
      userId: string;
      elementId: string;
      userAnswer: number;
    };

    try {
      await answerService.submitAnswer(userId, elementId, userAnswer);

      ctx.status = 200;
      ctx.body = {
        message: 'Answer submitted successfully.',
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      } else if (
        error instanceof Error &&
        error.message === 'Element not found'
      ) {
        ctx.status = 404;
        ctx.body = { message: 'Element not found' };
      } else {
        console.error('Error submitting user answer:', error);
        ctx.status = 500;
        ctx.body = { message: 'Failed to submit answer' };
      }
    }
  },
};
