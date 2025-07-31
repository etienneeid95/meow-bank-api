import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { type UUID } from 'node:crypto';
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

  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<AccountResponseDto> {
    return await this.accountsService.findById(id);
  }
}
