import { Context } from 'koa';
import { ValidationError } from '../middleware/error-handlers/validation-error';
import { answerService } from '../services';

/**
 * @swagger
 * tags:
 *   name: UserAnswers
 *   description: User answer submission
 */
export const answerController = {
  /**
   * @swagger
   * /user-answers:
   *   post:
   *     summary: Submit a user answer
   *     tags: [UserAnswers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - elementId
   *               - userAnswer
   *             properties:
   *               userId:
   *                 type: string
   *                 format: uuid
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               elementId:
   *                 type: string
   *                 format: uuid
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               userAnswer:
   *                 type: number
   *                 example: 5
   *     responses:
   *       200:
   *         description: Answer submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Answer submitted successfully."
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Element not found
   *       500:
   *         description: Server error
   */
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
