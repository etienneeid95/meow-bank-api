import { TransferResponseDto } from './transfer-response.dto';

export class AccountTransfersResponseDto {
  transfers: TransferResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    transfers: TransferResponseDto[],
    page: number,
    limit: number,
    total: number,
  ) {
    this.transfers = transfers;
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
