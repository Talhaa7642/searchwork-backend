import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserPreferencesTable1737928125964 implements MigrationInterface {
    name = 'CreateUserPreferencesTable1737928125964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "preferences" ("id" SERIAL NOT NULL, "hide_profile_data" boolean NOT NULL DEFAULT false, "notifications_enabled" boolean NOT NULL DEFAULT true, "theme" character varying, "show_email" boolean NOT NULL DEFAULT true, "show_phone_number" boolean NOT NULL DEFAULT true, "show_location" boolean NOT NULL DEFAULT true, "contact_via_email" boolean NOT NULL DEFAULT true, "contact_via_phone_number" boolean NOT NULL DEFAULT true, "contact_via_message" boolean NOT NULL DEFAULT true, "user_id" integer, CONSTRAINT "REL_34a542d34f1c75c43e78df2e67" UNIQUE ("user_id"), CONSTRAINT "PK_17f8855e4145192bbabd91a51be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "preferences" ADD CONSTRAINT "FK_34a542d34f1c75c43e78df2e67a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "preferences" DROP CONSTRAINT "FK_34a542d34f1c75c43e78df2e67a"`);
        await queryRunner.query(`DROP TABLE "preferences"`);
    }

}
