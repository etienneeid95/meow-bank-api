import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Transfer } from '../../entities';
import { TransferRepositoryInterface } from './transfer-repository.interface';

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
}
