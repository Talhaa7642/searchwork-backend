import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1734542319059 implements MigrationInterface {
    name = 'InitialMigration1734542319059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "address" character varying NOT NULL, "postal_code" character varying, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9dc9c02c4f76ca361095b73492" ON "location" ("latitude") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3c57d30acba84d0de84146682" ON "location" ("longitude") `);
        await queryRunner.query(`CREATE TABLE "job_seeker" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "skills" character varying, "professional_experience" character varying, "qualification" character varying, "major_subjects" character varying, "certificates" character varying NOT NULL, "certificates_data" character varying NOT NULL, "user_id" integer, CONSTRAINT "REL_0f8b08fb61217cfd889046c148" UNIQUE ("user_id"), CONSTRAINT "PK_431f9daff3d1d2acce028738586" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_job_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`);
        await queryRunner.query(`CREATE TABLE "user_job" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "status" "public"."user_job_status_enum" NOT NULL DEFAULT 'applied', "applied_at" TIMESTAMP NOT NULL DEFAULT now(), "job_post_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_cc98833a77eed71880f529f56b6" UNIQUE ("user_id", "job_post_id"), CONSTRAINT "PK_7e956aacee9897fbe87c9df4cc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_type_enum" AS ENUM('full time', 'part_time', 'contract', 'freelance')`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_availability_enum" AS ENUM('remote', 'on_site', 'hybrid')`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_experience_level_enum" AS ENUM('entry', 'intermediate', 'senior', 'expert')`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_duration_enum" AS ENUM('temporary', 'permanent')`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted')`);
        await queryRunner.query(`CREATE TABLE "job_post" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying, "type" "public"."job_post_type_enum" NOT NULL DEFAULT 'full time', "description" character varying, "requirements" character varying, "location_id" integer, "salary" integer NOT NULL, "availability" "public"."job_post_availability_enum" NOT NULL DEFAULT 'on_site', "experience_level" "public"."job_post_experience_level_enum" NOT NULL DEFAULT 'intermediate', "employer_id" integer NOT NULL, "duration" "public"."job_post_duration_enum" NOT NULL DEFAULT 'permanent', "status" "public"."job_post_status_enum" NOT NULL DEFAULT 'hiring', CONSTRAINT "UQ_ee26d130dc420c2e35f42573ce8" UNIQUE ("title"), CONSTRAINT "PK_a70f902a85e6de57340d153c813" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employer" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "company_name" character varying NOT NULL, "industry" character varying NOT NULL, "company_size" character varying, "registration_number" character varying, "user_id" integer, CONSTRAINT "UQ_f86e991e8b1c26fa589a49f2262" UNIQUE ("company_name"), CONSTRAINT "REL_6b1262606e8e48d624fa5557b3" UNIQUE ("user_id"), CONSTRAINT "PK_74029e6b1f17a4c7c66d43cfd34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('employee', 'employer', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "phone_number" character varying, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'employee', "gender" "public"."user_gender_enum", "is_email_verified" boolean NOT NULL DEFAULT false, "otp" character varying, "job_seeker_profile_id" integer, "location_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_05df4ce544b6615f9d121eb934" UNIQUE ("job_seeker_profile_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6a629b014ebdc48eff6784fe4a" ON "user" ("email", "phone_number") `);
        await queryRunner.query(`ALTER TABLE "job_seeker" ADD CONSTRAINT "FK_0f8b08fb61217cfd889046c1481" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_job" ADD CONSTRAINT "FK_f73d11ee54c1e4edd5d67264922" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_job" ADD CONSTRAINT "FK_94dc643d3b7d4636c7e95cb426c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_9633ba5a15d7f485f0aaedc650a" FOREIGN KEY ("employer_id") REFERENCES "employer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_8d9d8ffb751cf9d1b6982eec02b" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employer" ADD CONSTRAINT "FK_6b1262606e8e48d624fa5557b3e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_05df4ce544b6615f9d121eb9344" FOREIGN KEY ("job_seeker_profile_id") REFERENCES "job_seeker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_37bfb01591406f0fefaed6799a0" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_37bfb01591406f0fefaed6799a0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_05df4ce544b6615f9d121eb9344"`);
        await queryRunner.query(`ALTER TABLE "employer" DROP CONSTRAINT "FK_6b1262606e8e48d624fa5557b3e"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_8d9d8ffb751cf9d1b6982eec02b"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_9633ba5a15d7f485f0aaedc650a"`);
        await queryRunner.query(`ALTER TABLE "user_job" DROP CONSTRAINT "FK_94dc643d3b7d4636c7e95cb426c"`);
        await queryRunner.query(`ALTER TABLE "user_job" DROP CONSTRAINT "FK_f73d11ee54c1e4edd5d67264922"`);
        await queryRunner.query(`ALTER TABLE "job_seeker" DROP CONSTRAINT "FK_0f8b08fb61217cfd889046c1481"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a629b014ebdc48eff6784fe4a"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "employer"`);
        await queryRunner.query(`DROP TABLE "job_post"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_duration_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_experience_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_availability_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_type_enum"`);
        await queryRunner.query(`DROP TABLE "user_job"`);
        await queryRunner.query(`DROP TYPE "public"."user_job_status_enum"`);
        await queryRunner.query(`DROP TABLE "job_seeker"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3c57d30acba84d0de84146682"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9dc9c02c4f76ca361095b73492"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
