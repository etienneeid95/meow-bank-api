import { Injectable, Inject } from '@nestjs/common';
import { CreateCustomerDto, CustomerResponseDto } from './dto';
import { type CustomerRepositoryInterface } from './infra/database';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const savedCustomer =
      await this.customerRepository.create(createCustomerDto);

    return {
      id: savedCustomer.id,
      firstName: savedCustomer.firstName,
      lastName: savedCustomer.lastName,
    };
  }
}
