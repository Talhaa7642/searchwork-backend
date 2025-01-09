import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedFeedbackAndSupportTables1736462430681 implements MigrationInterface {
    name = 'CreatedFeedbackAndSupportTables1736462430681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feedback_text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "support_ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issue_title" character varying NOT NULL, "issue_description" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'open', "priority" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_506b4b9f579fb3adbaebe3950c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."user_job_status_enum" RENAME TO "user_job_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_job_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted', 'closed')`);
        await queryRunner.query(`ALTER TABLE "user_job" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_job" ALTER COLUMN "status" TYPE "public"."user_job_status_enum" USING "status"::"text"::"public"."user_job_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user_job" ALTER COLUMN "status" SET DEFAULT 'applied'`);
        await queryRunner.query(`DROP TYPE "public"."user_job_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_status_enum" RENAME TO "job_post_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted', 'closed')`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" TYPE "public"."job_post_status_enum" USING "status"::"text"::"public"."job_post_status_enum"`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" SET DEFAULT 'hiring'`);
        await queryRunner.query(`DROP TYPE "public"."job_post_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_121c67d42dd543cca0809f59901" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_ticket" ADD CONSTRAINT "FK_cb2e00c16c925e889f6e2dc2a4b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support_ticket" DROP CONSTRAINT "FK_cb2e00c16c925e889f6e2dc2a4b"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_121c67d42dd543cca0809f59901"`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_status_enum_old" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" TYPE "public"."job_post_status_enum_old" USING "status"::"text"::"public"."job_post_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "job_post" ALTER COLUMN "status" SET DEFAULT 'hiring'`);
        await queryRunner.query(`DROP TYPE "public"."job_post_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."job_post_status_enum_old" RENAME TO "job_post_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_job_status_enum_old" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`);
        await queryRunner.query(`ALTER TABLE "user_job" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_job" ALTER COLUMN "status" TYPE "public"."user_job_status_enum_old" USING "status"::"text"::"public"."user_job_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user_job" ALTER COLUMN "status" SET DEFAULT 'applied'`);
        await queryRunner.query(`DROP TYPE "public"."user_job_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_job_status_enum_old" RENAME TO "user_job_status_enum"`);
        await queryRunner.query(`DROP TABLE "support_ticket"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
