import { Injectable } from '@nestjs/common';
import { CreateCustomerDto, CustomerResponseDto } from './dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CustomersService {
  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return {
      id: randomUUID(),
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
    };
  }
}
