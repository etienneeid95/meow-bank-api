import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account } from './entities';
import { AccountRepository } from './infra/database';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), CustomersModule],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    {
      provide: 'AccountRepositoryInterface',
      useClass: AccountRepository,
    },
  ],
  exports: [
    {
      provide: 'AccountRepositoryInterface',
      useClass: AccountRepository,
    },
  ],
})
export class AccountsModule {}
