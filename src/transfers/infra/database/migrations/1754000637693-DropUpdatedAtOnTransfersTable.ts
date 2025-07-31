import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUpdatedAtOnTransfersTable1754000637693
  implements MigrationInterface
{
  name = 'DropUpdatedAtOnTransfersTable1754000637693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transfers" DROP COLUMN "updated_at"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
