import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from '../../dto';
import { Customer } from '../../entities';
import { CustomerRepositoryInterface } from './customer-repository.interface';
import { UUID } from 'node:crypto';

@Injectable()
export class CustomerRepository implements CustomerRepositoryInterface {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create({
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
    });

    return await this.customerRepository.save(customer);
  }

  async findById(id: UUID): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }
}
