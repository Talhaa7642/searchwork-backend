import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPhoneNumberVerification1735765528033 implements MigrationInterface {
    name = 'AddedPhoneNumberVerification1735765528033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_phone_number_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_phone_number_verified"`);
    }

}
