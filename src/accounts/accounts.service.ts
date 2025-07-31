import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto, AccountResponseDto } from './dto';
import type { AccountRepositoryInterface } from './infra/database';
import type { CustomerRepositoryInterface } from '../customers/infra/database';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('AccountRepositoryInterface')
    private readonly accountRepository: AccountRepositoryInterface,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async create(
    createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    const { customerId, balance } = createAccountDto;

    if (balance < 0) {
      throw new BadRequestException('Balance cannot be negative');
    }

    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const account = await this.accountRepository.create({
      customerId,
      balance,
    });

    return new AccountResponseDto(
      account.id,
      account.customerId,
      account.balance,
    );
  }
}
