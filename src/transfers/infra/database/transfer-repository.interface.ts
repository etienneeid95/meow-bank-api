import { EntityManager } from 'typeorm';
import { Transfer } from '../../entities';

export interface TransferRepositoryInterface {
  create(
    transferData: Partial<Transfer>,
    manager?: EntityManager,
  ): Promise<Transfer>;
}
