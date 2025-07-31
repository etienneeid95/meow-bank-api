import { Controller, Post, Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, AccountResponseDto } from './dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return await this.accountsService.create(createAccountDto);
  }
}
