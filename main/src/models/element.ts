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
 *     Element:
 *       type: object
 *       required:
 *         - elementId
 *         - eventId
 *         - projectId
 *         - scores
 *       properties:
 *         elementId:
 *           type: string
 *           format: uuid
 *           description: The element's unique identifier
 *         eventId:
 *           type: string
 *           format: uuid
 *           description: Associated event ID
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: Associated project ID
 *         rightAnswer:
 *           type: number
 *           nullable: true
 *           description: The correct answer (set after element creation)
 *         scores:
 *           type: number
 *           description: Points awarded for correct answer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
@Entity('elements')
export class Element {
  @PrimaryGeneratedColumn('uuid')
  elementId!: string;

  @Column('uuid')
  eventId!: string;

  @Column('uuid')
  projectId!: string;

  @Column('int', { nullable: true })
  rightAnswer!: number | null;

  @Column('int')
  scores!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
