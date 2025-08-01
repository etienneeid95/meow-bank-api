/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { type UUID, randomUUID } from 'node:crypto';
import { TransfersService } from './transfers.service';
import { MakeTransferDto, GetAccountTransfersDto } from './dto';
import { SortOrder } from './dto/sort-order.enum';
import { Transfer } from './entities/transfer.entity';
import { Account } from '../accounts/entities/account.entity';
import type { TransferRepositoryInterface } from './infra/database';
import type { AccountRepositoryInterface } from '../accounts/infra/database';

describe('TransfersService', () => {
  let service: TransfersService;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockEntityManager: jest.Mocked<EntityManager>;
  let mockTransferRepository: jest.Mocked<TransferRepositoryInterface>;
  let mockAccountRepository: jest.Mocked<AccountRepositoryInterface>;

  const mockAccountId1: UUID = randomUUID();
  const mockAccountId2: UUID = randomUUID();
  const mockTransferId: UUID = randomUUID();

  beforeEach(async () => {
    mockEntityManager = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    mockDataSource = {
      transaction: jest.fn(),
    } as unknown as jest.Mocked<DataSource>;

    mockTransferRepository = {
      create: jest.fn(),
      findByAccountId: jest.fn(),
    };

    mockAccountRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateBalance: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
        {
          provide: 'TransferRepositoryInterface',
          useValue: mockTransferRepository,
        },
        {
          provide: 'AccountRepositoryInterface',
          useValue: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('makeTransfer', () => {
    it('should throw BadRequestException when fromAccountId === toAccountId', async () => {
      const makeTransferDto: MakeTransferDto = {
        fromAccountId: mockAccountId1,
        toAccountId: mockAccountId1,
        amount: 100,
      };

      await expect(service.makeTransfer(makeTransferDto)).rejects.toThrow(
        new BadRequestException('Cannot transfer to the same account'),
      );

      expect(mockDataSource.transaction).not.toHaveBeenCalled();
      expect(mockAccountRepository.findById).not.toHaveBeenCalled();
      expect(mockAccountRepository.updateBalance).not.toHaveBeenCalled();
      expect(mockTransferRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when fromAccount is not found', async () => {
      const makeTransferDto: MakeTransferDto = {
        fromAccountId: mockAccountId1,
        toAccountId: mockAccountId2,
        amount: 100,
      };

      mockDataSource.transaction.mockImplementation(async (...args: any[]) => {
        const callback = args.length === 1 ? args[0] : args[1];
        return await callback(mockEntityManager);
      });

      mockAccountRepository.findById.mockResolvedValueOnce(null);

      await expect(service.makeTransfer(makeTransferDto)).rejects.toThrow(
        new NotFoundException(
          `From account with ID ${mockAccountId1} not found`,
        ),
      );

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId1,
        mockEntityManager,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.updateBalance).not.toHaveBeenCalled();
      expect(mockTransferRepository.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when toAccount is not found', async () => {
      const makeTransferDto: MakeTransferDto = {
        fromAccountId: mockAccountId1,
        toAccountId: mockAccountId2,
        amount: 100,
      };

      const mockFromAccount: Account = {
        id: mockAccountId1,
        customerId: randomUUID(),
        balance: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      mockDataSource.transaction.mockImplementation(async (...args: any[]) => {
        const callback = args.length === 1 ? args[0] : args[1];
        return await callback(mockEntityManager);
      });

      mockAccountRepository.findById
        .mockResolvedValueOnce(mockFromAccount)
        .mockResolvedValueOnce(null);

      await expect(service.makeTransfer(makeTransferDto)).rejects.toThrow(
        new NotFoundException(`To account with ID ${mockAccountId2} not found`),
      );

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId1,
        mockEntityManager,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId2,
        mockEntityManager,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockAccountRepository.updateBalance).not.toHaveBeenCalled();
      expect(mockTransferRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when fromAccount has insufficient balance', async () => {
      const makeTransferDto: MakeTransferDto = {
        fromAccountId: mockAccountId1,
        toAccountId: mockAccountId2,
        amount: 600,
      };

      const mockFromAccount: Account = {
        id: mockAccountId1,
        customerId: randomUUID(),
        balance: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      const mockToAccount: Account = {
        id: mockAccountId2,
        customerId: randomUUID(),
        balance: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      mockDataSource.transaction.mockImplementation(async (...args: any[]) => {
        const callback = args.length === 1 ? args[0] : args[1];
        return await callback(mockEntityManager);
      });

      mockAccountRepository.findById
        .mockResolvedValueOnce(mockFromAccount)
        .mockResolvedValueOnce(mockToAccount);

      await expect(service.makeTransfer(makeTransferDto)).rejects.toThrow(
        new BadRequestException('Insufficient balance in sender account'),
      );

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId1,
        mockEntityManager,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId2,
        mockEntityManager,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockAccountRepository.updateBalance).not.toHaveBeenCalled();
      expect(mockTransferRepository.create).not.toHaveBeenCalled();
    });

    it('should successfully create transfer when all conditions are met', async () => {
      const makeTransferDto: MakeTransferDto = {
        fromAccountId: mockAccountId1,
        toAccountId: mockAccountId2,
        amount: 100,
      };

      const mockFromAccount: Account = {
        id: mockAccountId1,
        customerId: randomUUID(),
        balance: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      const mockToAccount: Account = {
        id: mockAccountId2,
        customerId: randomUUID(),
        balance: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      const mockTransfer: Transfer = {
        id: mockTransferId,
        fromAccountId: mockAccountId1,
        toAccountId: mockAccountId2,
        amount: 100,
        createdAt: new Date(),
      } as Transfer;

      mockDataSource.transaction.mockImplementation(async (...args: any[]) => {
        const callback = args.length === 1 ? args[0] : args[1];
        return await callback(mockEntityManager);
      });

      mockAccountRepository.findById
        .mockResolvedValueOnce(mockFromAccount)
        .mockResolvedValueOnce(mockToAccount);
      mockAccountRepository.updateBalance
        .mockResolvedValueOnce({} as Account)
        .mockResolvedValueOnce({} as Account);
      mockTransferRepository.create.mockResolvedValue(mockTransfer);

      const result = await service.makeTransfer(makeTransferDto);

      expect(result).toEqual({
        id: mockTransferId,
        fromAccountId: mockAccountId1,
        toAccountId: mockAccountId2,
        amount: 100,
      });

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId1,
        mockEntityManager,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledWith(
        mockAccountId2,
        mockEntityManager,
      );
      expect(mockAccountRepository.findById).toHaveBeenCalledTimes(2);

      expect(mockAccountRepository.updateBalance).toHaveBeenCalledWith(
        mockAccountId1,
        400,
        mockEntityManager,
      );
      expect(mockAccountRepository.updateBalance).toHaveBeenCalledWith(
        mockAccountId2,
        300,
        mockEntityManager,
      );
      expect(mockAccountRepository.updateBalance).toHaveBeenCalledTimes(2);

      expect(mockTransferRepository.create).toHaveBeenCalledWith(
        {
          fromAccountId: mockAccountId1,
          toAccountId: mockAccountId2,
          amount: 100,
        },
        mockEntityManager,
      );
      expect(mockTransferRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAccountTransfers', () => {
    it('should successfully return account transfers when account has transfers', async () => {
      const query: GetAccountTransfersDto = {
        page: 1,
        limit: 10,
        sortOrder: SortOrder.DESC,
      };

      const mockTransfers: Transfer[] = [
        {
          id: mockTransferId,
          fromAccountId: mockAccountId1,
          toAccountId: mockAccountId2,
          amount: 100,
          createdAt: new Date(),
        } as Transfer,
      ];

      const mockRepositoryResult = {
        transfers: mockTransfers,
        total: 1,
      };

      mockTransferRepository.findByAccountId.mockResolvedValue(
        mockRepositoryResult,
      );

      const result = await service.getAccountTransfers(mockAccountId1, query);

      expect(result).toEqual({
        transfers: [
          {
            id: mockTransferId,
            fromAccountId: mockAccountId1,
            toAccountId: mockAccountId2,
            amount: 100,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });

      expect(mockTransferRepository.findByAccountId).toHaveBeenCalledWith(
        mockAccountId1,
        1,
        10,
        SortOrder.DESC,
      );
      expect(mockTransferRepository.findByAccountId).toHaveBeenCalledTimes(1);
    });

    it('should return empty transfers when account has no transfers', async () => {
      const query: GetAccountTransfersDto = {
        page: 1,
        limit: 10,
        sortOrder: SortOrder.DESC,
      };

      const mockRepositoryResult = {
        transfers: [],
        total: 0,
      };

      mockTransferRepository.findByAccountId.mockResolvedValue(
        mockRepositoryResult,
      );

      const result = await service.getAccountTransfers(mockAccountId1, query);

      expect(result).toEqual({
        transfers: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });

      expect(mockTransferRepository.findByAccountId).toHaveBeenCalledWith(
        mockAccountId1,
        1,
        10,
        SortOrder.DESC,
      );
      expect(mockTransferRepository.findByAccountId).toHaveBeenCalledTimes(1);
    });

    it('should handle custom pagination parameters', async () => {
      const query: GetAccountTransfersDto = {
        page: 2,
        limit: 5,
        sortOrder: SortOrder.ASC,
      };

      const mockRepositoryResult = {
        transfers: [],
        total: 15,
      };

      mockTransferRepository.findByAccountId.mockResolvedValue(
        mockRepositoryResult,
      );

      const result = await service.getAccountTransfers(mockAccountId1, query);

      expect(mockTransferRepository.findByAccountId).toHaveBeenCalledWith(
        mockAccountId1,
        2,
        5,
        SortOrder.ASC,
      );

      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3,
      });
    });
  });
});
