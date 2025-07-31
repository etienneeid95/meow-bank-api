import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { type UUID } from 'node:crypto';
import { Account } from '../../accounts/entities/account.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'from_account_id' })
  fromAccountId: UUID;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'from_account_id' })
  fromAccount: Account;

  @Column({ name: 'to_account_id' })
  toAccountId: UUID;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'to_account_id' })
  toAccount: Account;

  @Column('decimal', {
    precision: 15,
    scale: 2,
    nullable: false,
  })
  balance: number;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
