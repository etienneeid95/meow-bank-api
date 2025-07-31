import { IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { type UUID } from 'node:crypto';

export class CreateAccountDto {
  @IsUUID()
  customerId: UUID;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'The balance must be a valid currency amount with no more than two decimal places.',
    },
  )
  @Min(0, { message: 'Balance must be a positive number' })
  balance: number;
}
