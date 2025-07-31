import { type UUID } from 'node:crypto';

export class AccountResponseDto {
  id: UUID;
  customerId: UUID;
  balance: number;

  constructor(_id: UUID, _customerId: UUID, _balance: number) {
    this.id = _id;
    this.customerId = _customerId;
    this.balance = _balance;
  }
}
