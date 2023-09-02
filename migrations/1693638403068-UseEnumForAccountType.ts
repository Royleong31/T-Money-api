import { MigrationInterface, QueryRunner } from "typeorm";

export class UseEnumForAccountType1693638403068 implements MigrationInterface {
    name = 'UseEnumForAccountType1693638403068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_type"`);
        await queryRunner.query(`CREATE TYPE "public"."user_account_type_enum" AS ENUM('INDIVIDUAL', 'BUSINESS')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "account_type" "public"."user_account_type_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "account_type"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "account_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email_verified" DROP DEFAULT`);
    }

}
