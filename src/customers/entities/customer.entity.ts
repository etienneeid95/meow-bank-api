import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { type UUID } from 'node:crypto';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
