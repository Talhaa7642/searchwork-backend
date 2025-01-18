import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterEmployerTableToHideDetails1736966018120 implements MigrationInterface {
    name = 'AlterEmployerTableToHideDetails1736966018120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employer" ADD "hide_profile_data" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employer" DROP COLUMN "hide_profile_data"`);
    }

}
