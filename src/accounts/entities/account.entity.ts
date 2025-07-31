import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { type UUID } from 'node:crypto';
import { Customer } from '../../customers/entities/customer.entity';
import { Transfer } from '../../transfers/entities/transfer.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ name: 'customer_id' })
  customerId: UUID;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column('decimal', {
    precision: 15,
    scale: 2,
    default: 0,
  })
  balance: number;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.fromAccount)
  sentTransfers: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.toAccount)
  receivedTransfers: Transfer[];
}
