import { AppDataSource } from '../config/db';
import { Element } from '../models/element';
import { UserAnswer } from '../models/user-answer';
import { Score } from '../models/score';
import { redisClient } from '../config/redis';

export async function calculateUserScores(elementId: string): Promise<void> {
  console.log(`Starting score calculation for element: ${elementId}`);

  try {
    // Get the element
    const elementRepository = AppDataSource.getRepository(Element);
    const element = await elementRepository.findOne({ where: { elementId } });

    if (!element || element.rightAnswer === null) {
      throw new Error('Element not found or right answer not set');
    }

    // Get all user answers for this element
    const userAnswerRepository = AppDataSource.getRepository(UserAnswer);
    const userAnswers = await userAnswerRepository.find({
      where: { elementId },
    });

    console.log(
      `Processing ${userAnswers.length} answers for element ${elementId}`,
    );

    const scoreRepository = AppDataSource.getRepository(Score);

    // Process each user's answer
    for (const answer of userAnswers) {
      // Check if answer is correct
      const isCorrect = answer.userAnswer === element.rightAnswer;
      const pointsEarned = isCorrect ? element.scores : 0;

      // Find or create score record
      let score = await scoreRepository.findOne({
        where: {
          userId: answer.userId,
          elementId: element.elementId,
          projectId: element.projectId,
          eventId: element.eventId,
        },
      });

      if (!score) {
        score = new Score();
        score.userId = answer.userId;
        score.elementId = element.elementId;
        score.projectId = element.projectId;
        score.eventId = element.eventId;
        score.totalScore = 0;
      }

      // Update score
      score.totalScore += pointsEarned;
      await scoreRepository.save(score);

      console.log(
        `User ${answer.userId} earned ${pointsEarned} points for element ${elementId}`,
      );

      // Update user score in Redis
      try {
        await redisClient.set(
          `user:${answer.userId}:scores`,
          JSON.stringify(score),
          'EX',
          3600, // 1 hour expiration
        );
      } catch (error) {
        console.error('Failed to update Redis cache:', error);
        // Continue even if cache update fails
      }
    }

    // Invalidate leaderboard cache entries
    try {
      const leaderboardKeys = await redisClient.keys('leaderboard:*');
      if (leaderboardKeys.length > 0) {
        await redisClient.del(...leaderboardKeys);
        console.log(
          `Invalidated ${leaderboardKeys.length} leaderboard cache entries`,
        );
      }
    } catch (error) {
      console.error('Failed to invalidate leaderboard cache:', error);
      // Continue even if cache invalidation fails
    }

    console.log(`Score calculation completed for element ${elementId}`);
  } catch (error) {
    console.error('Error calculating scores:', error);
    throw error;
  }
}
