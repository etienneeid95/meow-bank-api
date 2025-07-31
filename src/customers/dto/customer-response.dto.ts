import { UUID } from 'node:crypto';

export class CustomerResponseDto {
  id: UUID;
  firstName: string;
  lastName: string;
}
