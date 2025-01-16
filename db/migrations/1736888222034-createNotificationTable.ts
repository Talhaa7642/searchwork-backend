import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTable1736888222034 implements MigrationInterface {
    name = 'CreateNotificationTable1736888222034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "message" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "job_post_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_70c33eea34b7a162396f18f976e" UNIQUE ("user_id", "job_post_id"), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_9edc44054a5429e48c8d0773176" FOREIGN KEY ("job_post_id") REFERENCES "job_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_9edc44054a5429e48c8d0773176"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
