import { CreateCustomerDto } from '../../dto';
import { Customer } from '../../entities';
import { UUID } from 'node:crypto';

export interface CustomerRepositoryInterface {
  create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
  findById(id: UUID): Promise<Customer | null>;
}
