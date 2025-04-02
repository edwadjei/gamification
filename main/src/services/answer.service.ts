import { AppDataSource } from '../config/db';
import { UserAnswer } from '../models/user-answer';
import { Element } from '../models/element';
import { ValidationError } from '../middleware/error-handlers/validation-error';
import { validate as uuidValidate } from 'uuid';

export const answerService = {
  async submitAnswer(
    userId: string,
    elementId: string,
    userAnswer: number,
  ): Promise<void> {
    // Validate inputs
    if (!userId || !uuidValidate(userId)) {
      throw new ValidationError('Valid userId is required');
    }

    if (!elementId || !uuidValidate(elementId)) {
      throw new ValidationError('Valid elementId is required');
    }

    if (
      userAnswer === undefined ||
      userAnswer === null ||
      typeof userAnswer !== 'number'
    ) {
      throw new ValidationError('userAnswer must be a number');
    }

    // Check if element exists
    const elementRepository = AppDataSource.getRepository(Element);
    const element = await elementRepository.findOne({ where: { elementId } });

    if (!element) {
      throw new Error('Element not found');
    }

    // Find or create user answer
    const userAnswerRepository = AppDataSource.getRepository(UserAnswer);

    let existingAnswer = await userAnswerRepository.findOne({
      where: {
        userId,
        elementId,
      },
    });

    if (existingAnswer) {
      // Update existing answer
      existingAnswer.userAnswer = userAnswer;
      await userAnswerRepository.save(existingAnswer);
    } else {
      // Create new answer
      const newUserAnswer = new UserAnswer();
      newUserAnswer.userId = userId;
      newUserAnswer.elementId = elementId;
      newUserAnswer.userAnswer = userAnswer;

      await userAnswerRepository.save(newUserAnswer);
    }
  },
};
