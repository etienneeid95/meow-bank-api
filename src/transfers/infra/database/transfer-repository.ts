import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { type UUID } from 'node:crypto';
import { Transfer } from '../../entities';
import { TransferRepositoryInterface } from './transfer-repository.interface';
import { SortOrder } from '../../dto/sort-order.enum';

@Injectable()
export class TransferRepository implements TransferRepositoryInterface {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
  ) {}

  async create(
    transferData: Partial<Transfer>,
    manager?: EntityManager,
  ): Promise<Transfer> {
    const repository =
      manager?.getRepository(Transfer) ?? this.transferRepository;
    const transfer = repository.create(transferData);
    return await repository.save(transfer);
  }

  async findByAccountId(
    accountId: UUID,
    page: number,
    limit: number,
    sortOrder: SortOrder,
  ): Promise<{ transfers: Transfer[]; total: number }> {
    const skip = (page - 1) * limit;

    const [transfers, total] = await this.transferRepository.findAndCount({
      where: [{ fromAccountId: accountId }, { toAccountId: accountId }],
      order: {
        createdAt: sortOrder,
      },
      skip,
      take: limit,
    });

    return { transfers, total };
  }
}
