import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProfileImageInUser1735927764089 implements MigrationInterface {
    name = 'AddedProfileImageInUser1735927764089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profile_image_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile_image_url"`);
    }

}
