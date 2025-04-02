import { Context } from 'koa';
import { elementService } from '../services/element.service';
import { ValidationError } from '../middleware/error-handlers/validation-error';

export const elementController = {
  async createElement(ctx: Context): Promise<void> {
    const { eventId, projectId, scores } = ctx.request.body as {
      eventId: string;
      projectId: string;
      scores: number;
    };

    try {
      const element = await elementService.createElement(
        eventId,
        projectId,
        scores,
      );

      ctx.status = 201;
      ctx.body = {
        elementId: element.elementId,
        message: 'Element created successfully.',
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error('Error creating element:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to create element' };
    }
  },

  async setRightAnswer(ctx: Context): Promise<void> {
    const elementId = ctx.params.elementId;
    const { rightAnswer } = ctx.request.body as { rightAnswer: number };

    try {
      await elementService.setRightAnswer(elementId, rightAnswer);

      ctx.status = 200;
      ctx.body = {
        message: 'Correct answer updated and score calculation triggered.',
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
        console.error('Error setting right answer:', error);
        ctx.status = 500;
        ctx.body = { message: 'Failed to set right answer' };
      }
    }
  },
};
