import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOtpExpireField1735769744393 implements MigrationInterface {
    name = 'AddedOtpExpireField1735769744393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "otp_expires_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp_expires_at"`);
    }

}
