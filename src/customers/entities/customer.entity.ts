import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { type UUID } from 'node:crypto';
import { Account } from '../../accounts/entities/account.entity';

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

  @OneToMany(() => Account, (account) => account.customer)
  accounts: Account[];
}
