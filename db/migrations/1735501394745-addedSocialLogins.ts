import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedSocialLogins1735501394745 implements MigrationInterface {
    name = 'AddedSocialLogins1735501394745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "platform" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "platform_token" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_type_enum" RENAME TO "job_post_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_type_enum" AS ENUM('full time', 'part_time', 'contract', 'freelance')`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "type" TYPE "public"."job_post_type_enum" USING "type"::"text"::"public"."job_post_type_enum"`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "type" SET DEFAULT 'full time'`);
        await queryRunner.query(`DROP TYPE "public"."job_post_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."job_post_type_enum_old" AS ENUM('full_time', 'part_time', 'contract', 'freelance')`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "type" TYPE "public"."job_post_type_enum_old" USING "type"::"text"::"public"."job_post_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "type" SET DEFAULT 'full_time'`);
        await queryRunner.query(`DROP TYPE "public"."job_post_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_type_enum_old" RENAME TO "job_post_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "platform_token"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "platform"`);
    }

}
