import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { MakeTransferDto, TransferResponseDto } from './dto';

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
}
