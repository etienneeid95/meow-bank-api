import { Controller, Post, Body } from '@nestjs/common';
import { CreateCustomerDto, CustomerResponseDto } from './dto';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customersService.create(createCustomerDto);
  }
}
