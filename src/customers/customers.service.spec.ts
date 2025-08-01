/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { type UUID, randomUUID } from 'node:crypto';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, CustomerResponseDto } from './dto';
import { Customer } from './entities/customer.entity';
import type { CustomerRepositoryInterface } from './infra/database';

describe('CustomersService', () => {
  let service: CustomersService;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryInterface>;

  const mockCustomerId: UUID = randomUUID();

  beforeEach(async () => {
    mockCustomerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: 'CustomerRepositoryInterface',
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCustomer: Customer = {
        id: mockCustomerId,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Customer;

      mockCustomerRepository.create.mockResolvedValue(mockCustomer);

      const result = await service.create(createCustomerDto);

      expect(result).toBeInstanceOf(CustomerResponseDto);
      expect(result.id).toBe(mockCustomerId);
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');

      expect(mockCustomerRepository.create).toHaveBeenCalledWith(
        createCustomerDto,
      );
      expect(mockCustomerRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
