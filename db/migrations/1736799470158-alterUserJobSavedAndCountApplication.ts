import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserJobSavedAndCountApplication1736799470158 implements MigrationInterface {
    name = 'AlterUserJobSavedAndCountApplication1736799470158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "saved_job" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "job_post_id" integer NOT NULL, CONSTRAINT "PK_eec7a26a4f0a651ab3d63c2a4a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "job_post" ADD "application_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "saved_job" ADD CONSTRAINT "FK_dc2c64f40719148d79921d424ba" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_job" ADD CONSTRAINT "FK_49a5d9ceba0170864ccb720c3cb" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_job" DROP CONSTRAINT "FK_49a5d9ceba0170864ccb720c3cb"`);
        await queryRunner.query(`ALTER TABLE "saved_job" DROP CONSTRAINT "FK_dc2c64f40719148d79921d424ba"`);
        await queryRunner.query(`ALTER TABLE "job_post" DROP COLUMN "application_count"`);
        await queryRunner.query(`DROP TABLE "saved_job"`);
    }

}
