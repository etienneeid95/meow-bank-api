import { type UUID } from 'node:crypto';
import { Account } from '../../entities';

export interface AccountRepositoryInterface {
  create(accountData: Partial<Account>): Promise<Account>;
  findById(id: UUID): Promise<Account | null>;
  updateBalance(id: UUID, newBalance: number): Promise<Account>;
}
