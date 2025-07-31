import { EntityManager } from 'typeorm';
import { type UUID } from 'node:crypto';
import { Transfer } from '../../entities';
import { SortOrder } from '../../dto/sort-order.enum';

export interface TransferRepositoryInterface {
  create(
    transferData: Partial<Transfer>,
    manager?: EntityManager,
  ): Promise<Transfer>;

  findByAccountId(
    accountId: UUID,
    page: number,
    limit: number,
    sortOrder: SortOrder,
  ): Promise<{ transfers: Transfer[]; total: number }>;
}
