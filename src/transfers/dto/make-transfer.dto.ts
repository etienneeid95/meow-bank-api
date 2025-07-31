import { IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { type UUID } from 'node:crypto';

export class MakeTransferDto {
  @IsUUID()
  fromAccountId: UUID;

  @IsUUID()
  toAccountId: UUID;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'The amount must be a valid currency amount with no more than two decimal places.',
    },
  )
  @Min(0.01, { message: 'Amount must be a positive number' })
  amount: number;
}
