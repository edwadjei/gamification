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
 *     User:
 *       type: object
 *       required:
 *         - userId
 *         - username
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The user's unique identifier
 *         username:
 *           type: string
 *           description: The username (must be unique)
 *         displayName:
 *           type: string
 *           description: Display name for the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column('varchar', { length: 100, unique: true })
  username!: string;

  @Column('varchar', { length: 255, nullable: true })
  displayName?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
