import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBalanceToAmountOnTransfersTable1753999313194
  implements MigrationInterface
{
  name = 'RenameBalanceToAmountOnTransfersTable1753999313194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfers" RENAME COLUMN "balance" TO "amount"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfers" RENAME COLUMN "amount" TO "balance"`,
    );
  }
}
