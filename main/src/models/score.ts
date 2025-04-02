import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
