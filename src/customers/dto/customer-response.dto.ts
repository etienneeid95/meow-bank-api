import { UUID } from 'node:crypto';

export class CustomerResponseDto {
  id: UUID;
  firstName: string;
  lastName: string;

  constructor(_id: UUID, _firstName: string, _lastName: string) {
    this.id = _id;
    this.firstName = _firstName;
    this.lastName = _lastName;
  }
}
