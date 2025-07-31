import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities';
import { AccountsModule } from '../accounts/accounts.module';
import { TransferRepository } from './infra/database';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), AccountsModule],
  controllers: [TransfersController],
  providers: [
    TransfersService,
    {
      provide: 'TransferRepositoryInterface',
      useClass: TransferRepository,
    },
  ],
})
export class TransfersModule {}
