import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MakeTransferDto, TransferResponseDto } from './dto';
import type { TransferRepositoryInterface } from './infra/database';
import type { AccountRepositoryInterface } from '../accounts/infra/database';

@Injectable()
export class TransfersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject('TransferRepositoryInterface')
    private readonly transferRepository: TransferRepositoryInterface,
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  async makeTransfer(
    makeTransferDto: MakeTransferDto,
  ): Promise<TransferResponseDto> {
    const { fromAccountId, toAccountId, amount } = makeTransferDto;

    if (amount <= 0) {
      throw new BadRequestException('Balance must be a positive number');
    }

    if (fromAccountId === toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    return await this.dataSource.transaction(async (manager) => {
      const fromAccount = await this.accountRepository.findById(
        fromAccountId,
        manager,
      );
      if (!fromAccount) {
        throw new NotFoundException(
          `From account with ID ${fromAccountId} not found`,
        );
      }

      const toAccount = await this.accountRepository.findById(
        toAccountId,
        manager,
      );
      if (!toAccount) {
        throw new NotFoundException(
          `To account with ID ${toAccountId} not found`,
        );
      }

      if (fromAccount.balance < amount) {
        throw new BadRequestException('Insufficient balance in sender account');
      }

      const newFromBalance = fromAccount.balance - amount;
      const newToBalance = toAccount.balance + amount;

      await this.accountRepository.updateBalance(
        fromAccountId,
        newFromBalance,
        manager,
      );
      await this.accountRepository.updateBalance(
        toAccountId,
        newToBalance,
        manager,
      );

      const transfer = await this.transferRepository.create(
        {
          fromAccountId,
          toAccountId,
          amount,
        },
        manager,
      );

      return new TransferResponseDto(
        transfer.id,
        transfer.fromAccountId,
        transfer.toAccountId,
        transfer.amount,
      );
    });
  }
}
