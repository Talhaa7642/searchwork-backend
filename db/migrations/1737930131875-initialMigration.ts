import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1737930131875 implements MigrationInterface {
    name = 'InitialMigration1737930131875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "city" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "address" character varying NOT NULL, "postal_code" character varying, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9dc9c02c4f76ca361095b73492" ON "location" ("latitude") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3c57d30acba84d0de84146682" ON "location" ("longitude") `);
        await queryRunner.query(`CREATE TABLE "job_seeker" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "skills" character varying, "professional_experience" character varying, "qualification" character varying, "major_subjects" character varying, "certificates" character varying, "certificates_data" character varying, "user_id" integer, CONSTRAINT "REL_0f8b08fb61217cfd889046c148" UNIQUE ("user_id"), CONSTRAINT "PK_431f9daff3d1d2acce028738586" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_job_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted', 'closed')`);
        await queryRunner.query(`CREATE TABLE "user_job" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "status" "public"."user_job_status_enum" NOT NULL DEFAULT 'applied', "applied_at" TIMESTAMP NOT NULL DEFAULT now(), "is_viewed" boolean NOT NULL DEFAULT false, "job_post_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_cc98833a77eed71880f529f56b6" UNIQUE ("user_id", "job_post_id"), CONSTRAINT "PK_7e956aacee9897fbe87c9df4cc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saved_job" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "job_post_id" integer NOT NULL, CONSTRAINT "PK_eec7a26a4f0a651ab3d63c2a4a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "message" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "job_post_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_70c33eea34b7a162396f18f976e" UNIQUE ("user_id", "job_post_id"), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_type_enum" AS ENUM('full_time', 'part_time', 'contract', 'freelance')`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_availability_enum" AS ENUM('remote', 'on_site', 'hybrid')`);
        await queryRunner.query(`CREATE TYPE "public"."job_post_status_enum" AS ENUM('applied', 'hiring', 'rejected', 'accepted', 'closed')`);
        await queryRunner.query(`CREATE TABLE "job_post" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "type" "public"."job_post_type_enum" NOT NULL DEFAULT 'full_time', "description" character varying, "location" character varying, "salary" integer NOT NULL, "availability" "public"."job_post_availability_enum" NOT NULL DEFAULT 'on_site', "employer_id" integer NOT NULL, "status" "public"."job_post_status_enum" NOT NULL DEFAULT 'hiring', "application_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_a70f902a85e6de57340d153c813" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employer" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "company_name" character varying NOT NULL, "industry" character varying NOT NULL, "company_size" character varying, "registration_number" character varying, "hide_profile_data" boolean NOT NULL DEFAULT false, "user_id" integer, CONSTRAINT "UQ_f86e991e8b1c26fa589a49f2262" UNIQUE ("company_name"), CONSTRAINT "REL_6b1262606e8e48d624fa5557b3" UNIQUE ("user_id"), CONSTRAINT "PK_74029e6b1f17a4c7c66d43cfd34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feedback_text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "support_ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issue_title" character varying NOT NULL, "issue_description" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'open', "priority" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_506b4b9f579fb3adbaebe3950c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "preferences" ("id" SERIAL NOT NULL, "hide_profile_data" boolean NOT NULL DEFAULT false, "notifications_enabled" boolean NOT NULL DEFAULT true, "theme" character varying, "show_email" boolean NOT NULL DEFAULT true, "show_phone_number" boolean NOT NULL DEFAULT true, "show_location" boolean NOT NULL DEFAULT true, "contact_via_email" boolean NOT NULL DEFAULT true, "contact_via_phone_number" boolean NOT NULL DEFAULT true, "contact_via_message" boolean NOT NULL DEFAULT true, "user_id" integer, CONSTRAINT "REL_34a542d34f1c75c43e78df2e67" UNIQUE ("user_id"), CONSTRAINT "PK_17f8855e4145192bbabd91a51be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('employee', 'employer', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "phone_number" character varying, "is_phone_number_verified" boolean NOT NULL DEFAULT false, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'employee', "gender" "public"."user_gender_enum", "is_email_verified" boolean NOT NULL DEFAULT false, "otp" character varying, "otp_expires_at" TIMESTAMP, "platform" character varying, "platform_token" character varying, "profile_image_url" character varying, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6a629b014ebdc48eff6784fe4a" ON "user" ("email", "phone_number") `);
        await queryRunner.query(`ALTER TABLE "job_seeker" ADD CONSTRAINT "FK_0f8b08fb61217cfd889046c1481" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_job" ADD CONSTRAINT "FK_f73d11ee54c1e4edd5d67264922" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_job" ADD CONSTRAINT "FK_94dc643d3b7d4636c7e95cb426c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_job" ADD CONSTRAINT "FK_dc2c64f40719148d79921d424ba" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_job" ADD CONSTRAINT "FK_49a5d9ceba0170864ccb720c3cb" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_9edc44054a5429e48c8d0773176" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD CONSTRAINT "FK_9633ba5a15d7f485f0aaedc650a" FOREIGN KEY ("employer_id") REFERENCES "employer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employer" ADD CONSTRAINT "FK_6b1262606e8e48d624fa5557b3e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_121c67d42dd543cca0809f59901" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_ticket" ADD CONSTRAINT "FK_cb2e00c16c925e889f6e2dc2a4b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_34a542d34f1c75c43e78df2e67a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_34a542d34f1c75c43e78df2e67a"`);
        await queryRunner.query(`ALTER TABLE "support_ticket" DROP CONSTRAINT "FK_cb2e00c16c925e889f6e2dc2a4b"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_121c67d42dd543cca0809f59901"`);
        await queryRunner.query(`ALTER TABLE "employer" DROP CONSTRAINT "FK_6b1262606e8e48d624fa5557b3e"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP CONSTRAINT "FK_9633ba5a15d7f485f0aaedc650a"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_9edc44054a5429e48c8d0773176"`);
        await queryRunner.query(`ALTER TABLE "saved_job" DROP CONSTRAINT "FK_49a5d9ceba0170864ccb720c3cb"`);
        await queryRunner.query(`ALTER TABLE "saved_job" DROP CONSTRAINT "FK_dc2c64f40719148d79921d424ba"`);
        await queryRunner.query(`ALTER TABLE "user_job" DROP CONSTRAINT "FK_94dc643d3b7d4636c7e95cb426c"`);
        await queryRunner.query(`ALTER TABLE "user_job" DROP CONSTRAINT "FK_f73d11ee54c1e4edd5d67264922"`);
        await queryRunner.query(`ALTER TABLE "job_seeker" DROP CONSTRAINT "FK_0f8b08fb61217cfd889046c1481"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a629b014ebdc48eff6784fe4a"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "preferences"`);
        await queryRunner.query(`DROP TABLE "support_ticket"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP TABLE "employer"`);
        await queryRunner.query(`DROP TABLE "job_post"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_availability_enum"`);
        await queryRunner.query(`DROP TYPE "public"."job_post_type_enum"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "saved_job"`);
        await queryRunner.query(`DROP TABLE "user_job"`);
        await queryRunner.query(`DROP TYPE "public"."user_job_status_enum"`);
        await queryRunner.query(`DROP TABLE "job_seeker"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3c57d30acba84d0de84146682"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9dc9c02c4f76ca361095b73492"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
