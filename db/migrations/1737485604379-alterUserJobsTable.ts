import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserJobsTable1737485604379 implements MigrationInterface {
    name = 'AlterUserJobsTable1737485604379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_job" ADD "is_viewed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_job" DROP COLUMN "is_viewed"`);
    }

}
