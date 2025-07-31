import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), AccountsModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
