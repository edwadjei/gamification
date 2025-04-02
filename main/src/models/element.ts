import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
