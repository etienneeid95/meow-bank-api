import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { type UUID } from 'node:crypto';
import { Account } from '../../entities';
import { AccountRepositoryInterface } from './account-repository.interface';

@Injectable()
export class AccountRepository implements AccountRepositoryInterface {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(accountData: Partial<Account>): Promise<Account> {
    const account = this.accountRepository.create(accountData);
    return await this.accountRepository.save(account);
  }

  async findById(id: UUID, manager?: EntityManager): Promise<Account | null> {
    const repository =
      manager?.getRepository(Account) ?? this.accountRepository;
    return await repository.findOne({ where: { id } });
  }

  async updateBalance(
    id: UUID,
    newBalance: number,
    manager?: EntityManager,
  ): Promise<Account> {
    const repository =
      manager?.getRepository(Account) ?? this.accountRepository;

    const existingAccount = await repository.findOne({ where: { id } });
    if (!existingAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await repository.update({ id }, { balance: newBalance });
    return { ...existingAccount, balance: newBalance };
  }
}
