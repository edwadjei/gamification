import { AppDataSource } from '../config/db';
import { User } from '../models/user';
import { Element } from '../models/element';
import { UserAnswer } from '../models/user-answer';
import { Score } from '../models/score';
import { v4 as uuidv4 } from 'uuid';

// Sample data
const PROJECT_ID = uuidv4();
const EVENT_ID = uuidv4();

// User data
const USERS = [
  { username: 'alice', displayName: 'Alice' },
  { username: 'bob', displayName: 'Bob' },
  { username: 'charlie', displayName: 'Charlie' },
  { username: 'david', displayName: 'David' },
  { username: 'emma', displayName: 'Emma' },
];

// Elements data (questions)
const ELEMENTS = [
  { scores: 10, rightAnswer: 5 },
  { scores: 20, rightAnswer: 7 },
  { scores: 30, rightAnswer: 3 },
  { scores: 40, rightAnswer: 9 },
  { scores: 50, rightAnswer: 1 },
];

async function seed() {
  console.log('Starting database seed...');

  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Create repositories
    const userRepository = AppDataSource.getRepository(User);
    const elementRepository = AppDataSource.getRepository(Element);
    const userAnswerRepository = AppDataSource.getRepository(UserAnswer);
    const scoreRepository = AppDataSource.getRepository(Score);

    // Create users
    console.log('Creating users...');
    const createdUsers: User[] = [];

    for (const userData of USERS) {
      const user = new User();
      user.userId = uuidv4();
      user.username = userData.username;
      user.displayName = userData.displayName;

      await userRepository.save(user);
      createdUsers.push(user);

      console.log(`Created user: ${user.username} (${user.userId})`);
    }

    // Create elements
    console.log('Creating elements...');
    const createdElements: Element[] = [];

    for (const elementData of ELEMENTS) {
      const element = new Element();
      element.elementId = uuidv4();
      element.projectId = PROJECT_ID;
      element.eventId = EVENT_ID;
      element.scores = elementData.scores;
      element.rightAnswer = elementData.rightAnswer;

      await elementRepository.save(element);
      createdElements.push(element);

      console.log(
        `Created element: ${element.elementId} (points: ${element.scores}, answer: ${element.rightAnswer})`,
      );
    }

    // Create user answers (some correct, some incorrect)
    console.log('Creating user answers...');

    for (const user of createdUsers) {
      for (const element of createdElements) {
        // Randomly decide if answer is correct (50% chance)
        const isCorrect = Math.random() > 0.5;

        const userAnswer = new UserAnswer();
        userAnswer.userId = user.userId;
        userAnswer.elementId = element.elementId;

        if (isCorrect) {
          userAnswer.userAnswer = element.rightAnswer!;
        } else {
          // Generate a random wrong answer
          let wrongAnswer;
          do {
            wrongAnswer = Math.floor(Math.random() * 10) + 1;
          } while (wrongAnswer === element.rightAnswer);

          userAnswer.userAnswer = wrongAnswer;
        }

        await userAnswerRepository.save(userAnswer);

        console.log(
          `Created answer for ${user.username} on element ${
            element.elementId
          }: ${userAnswer.userAnswer} (${isCorrect ? 'correct' : 'incorrect'})`,
        );

        // Calculate and store score
        if (isCorrect) {
          const score = new Score();
          score.scoreId = uuidv4();
          score.userId = user.userId;
          score.elementId = element.elementId;
          score.projectId = element.projectId;
          score.eventId = element.eventId;
          score.totalScore = element.scores;

          await scoreRepository.save(score);
          console.log(
            `Created score for ${user.username}: ${score.totalScore} points`,
          );
        }
      }
    }

    console.log('Seed completed successfully!');
    console.log('===========================================');
    console.log(`Project ID: ${PROJECT_ID}`);
    console.log(`Event ID: ${EVENT_ID}`);
    console.log('===========================================');
    console.log('Created:');
    console.log(`- ${createdUsers.length} users`);
    console.log(`- ${createdElements.length} elements`);
    console.log(
      `- ${createdUsers.length * createdElements.length} user answers`,
    );

    // Display users for easier testing
    console.log('===========================================');
    console.log('Users created:');
    createdUsers.forEach((user) => {
      console.log(`- ${user.displayName} (ID: ${user.userId})`);
    });
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

// Run the seed function
seed();
