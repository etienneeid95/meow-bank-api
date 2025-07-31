import { type UUID } from 'node:crypto';
import { EntityManager } from 'typeorm';
import { Account } from '../../entities';

export interface AccountRepositoryInterface {
  create(accountData: Partial<Account>): Promise<Account>;
  findById(id: UUID, manager?: EntityManager): Promise<Account | null>;
  updateBalance(
    id: UUID,
    newBalance: number,
    manager?: EntityManager,
  ): Promise<Account>;
}
