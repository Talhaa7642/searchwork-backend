import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTablePasswordField1735771575089 implements MigrationInterface {
    name = 'AlterUserTablePasswordField1735771575089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
    }

}
