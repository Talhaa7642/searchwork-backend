import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConsumer1713817561333 implements MigrationInterface {
    name = 'CreateConsumer1713817561333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "consumer" ("id" SERIAL NOT NULL, "phoneNumber" character varying NOT NULL, "fullName" character varying, "address" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_4c06c252e67350916133f013aff" UNIQUE ("phoneNumber"), CONSTRAINT "PK_85625b4d465d3aa0eb905127822" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "consumer"`);
    }

}
