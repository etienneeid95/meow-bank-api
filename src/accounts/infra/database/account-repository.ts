import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findById(id: UUID): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { id } });
  }

  async updateBalance(id: UUID, newBalance: number): Promise<Account> {
    const existingAccount = await this.accountRepository.findOne({
      where: { id },
    });
    if (!existingAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await this.accountRepository.update({ id }, { balance: newBalance });

    return { ...existingAccount, balance: newBalance };
  }
}
