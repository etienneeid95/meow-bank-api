import { type UUID } from 'node:crypto';

export class TransferResponseDto {
  id: UUID;
  fromAccountId: UUID;
  toAccountId: UUID;
  amount: number;

  constructor(
    _id: UUID,
    _fromAccountId: UUID,
    _toAccountId: UUID,
    _amount: number,
  ) {
    this.id = _id;
    this.fromAccountId = _fromAccountId;
    this.toAccountId = _toAccountId;
    this.amount = _amount;
  }
}
