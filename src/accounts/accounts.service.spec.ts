/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { type UUID, randomUUID } from 'node:crypto';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, AccountResponseDto } from './dto';
import { Account } from './entities/account.entity';
import { Customer } from '../customers/entities/customer.entity';
import type { AccountRepositoryInterface } from './infra/database';
import type { CustomerRepositoryInterface } from '../customers/infra/database';

describe('AccountsService', () => {
  let service: AccountsService;
  let mockAccountRepository: jest.Mocked<AccountRepositoryInterface>;
  let mockCustomerRepository: jest.Mocked<CustomerRepositoryInterface>;

  const mockCustomerId: UUID = randomUUID();
  const mockAccountId: UUID = randomUUID();

  beforeEach(async () => {
    mockAccountRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateBalance: jest.fn(),
    };

    mockCustomerRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: 'AccountRepositoryInterface',
          useValue: mockAccountRepository,
        },
        {
          provide: 'CustomerRepositoryInterface',
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw NotFoundException when customer is not found', async () => {
      const createAccountDto: CreateAccountDto = {
        customerId: mockCustomerId,
        balance: 100,
      };

      mockCustomerRepository.findById.mockResolvedValue(null);

      await expect(service.create(createAccountDto)).rejects.toThrow(
        new NotFoundException(`Customer with ID ${mockCustomerId} not found`),
      );

      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(
        mockCustomerId,
      );
      expect(mockCustomerRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.create).not.toHaveBeenCalled();
    });

    it('should successfully create account when customer exists', async () => {
      const createAccountDto: CreateAccountDto = {
        customerId: mockCustomerId,
        balance: 100,
      };

      const mockCustomer: Customer = {
        id: mockCustomerId,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Customer;

      const mockAccount: Account = {
        id: mockAccountId,
        customerId: mockCustomerId,
        balance: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
      mockAccountRepository.create.mockResolvedValue(mockAccount);

      const result = await service.create(createAccountDto);

      expect(result).toBeInstanceOf(AccountResponseDto);
      expect(result.id).toBe(mockAccountId);
      expect(result.customerId).toBe(mockCustomerId);
      expect(result.balance).toBe(100);

      expect(mockCustomerRepository.findById).toHaveBeenCalledWith(
        mockCustomerId,
      );
      expect(mockCustomerRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.create).toHaveBeenCalledWith({
        customerId: mockCustomerId,
        balance: 100,
      });
      expect(mockAccountRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when account is not found', async () => {
      mockAccountRepository.findById.mockResolvedValue(null);

      await expect(service.findById(mockAccountId)).rejects.toThrow(
        new NotFoundException(`Account with ID ${mockAccountId} not found`),
      );

      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should successfully return account when account exists', async () => {
      const mockAccount: Account = {
        id: mockAccountId,
        customerId: mockCustomerId,
        balance: 250,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      mockAccountRepository.findById.mockResolvedValue(mockAccount);

      const result = await service.findById(mockAccountId);

      expect(result).toBeInstanceOf(AccountResponseDto);
      expect(result.id).toBe(mockAccountId);
      expect(result.customerId).toBe(mockCustomerId);
      expect(result.balance).toBe(250);

      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
