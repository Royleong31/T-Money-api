import { MigrationInterface, QueryRunner } from "typeorm";

export class UseTimeZoneDates1693587846175 implements MigrationInterface {
    name = 'UseTimeZoneDates1693587846175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_info" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "business_info" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "business_info" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "business_info" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d091f1d36f18bbece2a9eabc6e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_d091f1d36f18bbece2a9eabc6e" ON "user" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d091f1d36f18bbece2a9eabc6e"`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_info" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user_info" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`CREATE INDEX "IDX_d091f1d36f18bbece2a9eabc6e" ON "user" ("created_at") `);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "business_info" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "business_info" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "business_info" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "business_info" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
