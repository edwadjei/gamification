import { AppDataSource } from '../config/db';
import { Element } from '../models/element';
import { ValidationError } from '../middleware/error-handlers/validation-error';
import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { calculateUserScores } from '../jobs/calculate-scores.job';

export const elementService = {
  async createElement(
    eventId: string,
    projectId: string,
    scores: number,
  ): Promise<Element> {
    // Validate inputs
    if (!eventId || !uuidValidate(eventId)) {
      throw new ValidationError('Valid eventId is required');
    }

    if (!projectId || !uuidValidate(projectId)) {
      throw new ValidationError('Valid projectId is required');
    }

    if (!scores || typeof scores !== 'number' || scores <= 0) {
      throw new ValidationError('Scores must be a positive number');
    }

    // Create new element
    const elementRepository = AppDataSource.getRepository(Element);

    const newElement = new Element();
    newElement.elementId = uuidv4();
    newElement.eventId = eventId;
    newElement.projectId = projectId;
    newElement.scores = scores;

    return await elementRepository.save(newElement);
  },

  async setRightAnswer(elementId: string, rightAnswer: number): Promise<void> {
    // Validate inputs
    if (!elementId || !uuidValidate(elementId)) {
      throw new ValidationError('Valid elementId is required');
    }

    if (
      rightAnswer === undefined ||
      rightAnswer === null ||
      typeof rightAnswer !== 'number'
    ) {
      throw new ValidationError('rightAnswer must be a number');
    }

    // Find and update element
    const elementRepository = AppDataSource.getRepository(Element);
    const element = await elementRepository.findOne({ where: { elementId } });

    if (!element) {
      throw new Error('Element not found');
    }

    element.rightAnswer = rightAnswer;
    await elementRepository.save(element);

    // TODO: Trigger score calculation job
    await calculateUserScores(elementId);
  },
};
