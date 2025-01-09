import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterJobTitle1736288574456 implements MigrationInterface {
    name = 'AlterJobTitle1736288574456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "UQ_ee26d130dc420c2e35f42573ce8"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "UQ_ee26d130dc420c2e35f42573ce8" UNIQUE ("title")`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "title" DROP NOT NULL`);
    }

}
