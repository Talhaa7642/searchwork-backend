import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterLocationToStringForm1736286891323 implements MigrationInterface {
    name = 'AlterLocationToStringForm1736286891323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_8d9d8ffb751cf9d1b6982eec02b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_05df4ce544b6615f9d121eb9344"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_37bfb01591406f0fefaed6799a0"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "requirements"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "location_id"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "experience_level"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_experience_level_enum"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "duration"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_duration_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_05df4ce544b6615f9d121eb934"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "job_seeker_profile_id"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "location_id"`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "location" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "location_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "job_seeker_profile_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_05df4ce544b6615f9d121eb934" UNIQUE ("job_seeker_profile_id")`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_duration_enum" AS ENUM('temporary', 'permanent')`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "duration" "public"."job_post_duration_enum" NOT NULL DEFAULT 'permanent'`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_experience_level_enum" AS ENUM('entry', 'intermediate', 'senior', 'expert')`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "experience_level" "public"."job_post_experience_level_enum" NOT NULL DEFAULT 'intermediate'`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "location_id" integer`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "requirements" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_37bfb01591406f0fefaed6799a0" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_05df4ce544b6615f9d121eb9344" FOREIGN KEY ("job_seeker_profile_id") REFERENCES "job_seeker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_8d9d8ffb751cf9d1b6982eec02b" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
