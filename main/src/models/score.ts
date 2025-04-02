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
 *     Score:
 *       type: object
 *       required:
 *         - scoreId
 *         - userId
 *         - projectId
 *         - eventId
 *         - elementId
 *       properties:
 *         scoreId:
 *           type: string
 *           format: uuid
 *           description: The score's unique identifier
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User who earned the score
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: Associated project ID
 *         eventId:
 *           type: string
 *           format: uuid
 *           description: Associated event ID
 *         elementId:
 *           type: string
 *           format: uuid
 *           description: Associated element ID
 *         totalScore:
 *           type: number
 *           description: Total score value
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn('uuid')
  scoreId!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  projectId!: string;

  @Column('uuid')
  eventId!: string;

  @Column('uuid')
  elementId!: string;

  @Column('int', { default: 0 })
  totalScore!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
