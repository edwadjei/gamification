import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAnswer:
 *       type: object
 *       required:
 *         - userId
 *         - elementId
 *         - userAnswer
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The user answer's unique identifier
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User who submitted the answer
 *         elementId:
 *           type: string
 *           format: uuid
 *           description: Element that was answered
 *         userAnswer:
 *           type: number
 *           description: The answer submitted by the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  elementId!: string;

  @Column('int')
  userAnswer!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
