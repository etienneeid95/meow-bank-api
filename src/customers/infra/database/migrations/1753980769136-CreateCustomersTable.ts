import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersTable1753980769136 implements MigrationInterface {
  name = 'CreateCustomersTable1753980769136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "customers" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
