import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { type UUID } from 'node:crypto';
import { TransfersService } from './transfers.service';
import {
  MakeTransferDto,
  TransferResponseDto,
  GetAccountTransfersDto,
  AccountTransfersResponseDto,
} from './dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async makeTransfer(
    @Body() makeTransferDto: MakeTransferDto,
  ): Promise<TransferResponseDto> {
    return await this.transfersService.makeTransfer(makeTransferDto);
  }

  @Get('accounts/:accountId')
  async getAccountTransfers(
    @Param('accountId', ParseUUIDPipe) accountId: UUID,
    @Query() query: GetAccountTransfersDto,
  ): Promise<AccountTransfersResponseDto> {
    return await this.transfersService.getAccountTransfers(accountId, query);
  }
}
