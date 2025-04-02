import { Context } from 'koa';
import { elementService } from '../services';
import { ValidationError } from '../middleware/error-handlers/validation-error';

/**
 * @swagger
 * tags:
 *   name: Elements
 *   description: Element management
 */
export const elementController = {
  /**
   * @swagger
   * /elements:
   *   post:
   *     summary: Create a new element
   *     tags: [Elements]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - eventId
   *               - projectId
   *               - scores
   *             properties:
   *               eventId:
   *                 type: string
   *                 format: uuid
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               projectId:
   *                 type: string
   *                 format: uuid
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               scores:
   *                 type: number
   *                 example: 10
   *     responses:
   *       201:
   *         description: Element created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 elementId:
   *                   type: string
   *                   format: uuid
   *                 message:
   *                   type: string
   *                   example: "Element created successfully."
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Server error
   */
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

  /**
   * @swagger
   * /elements/{elementId}/right-answer:
   *   put:
   *     summary: Set the correct answer for an element
   *     tags: [Elements]
   *     parameters:
   *       - in: path
   *         name: elementId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Element's unique ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - rightAnswer
   *             properties:
   *               rightAnswer:
   *                 type: number
   *                 example: 3
   *     responses:
   *       200:
   *         description: Correct answer updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Correct answer updated and score calculation triggered."
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Element not found
   *       500:
   *         description: Server error
   */
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
