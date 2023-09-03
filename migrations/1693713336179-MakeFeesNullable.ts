import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeFeesNullable1693713336179 implements MigrationInterface {
    name = 'MakeFeesNullable1693713336179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pay_pal_deposit" DROP COLUMN "fees"`);
        await queryRunner.query(`ALTER TABLE "pay_pal_deposit" ADD "fees" numeric`);
        await queryRunner.query(`ALTER TABLE "pay_pal_withdraw" DROP COLUMN "fees"`);
        await queryRunner.query(`ALTER TABLE "pay_pal_withdraw" ADD "fees" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pay_pal_withdraw" DROP COLUMN "fees"`);
        await queryRunner.query(`ALTER TABLE "pay_pal_withdraw" ADD "fees" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pay_pal_deposit" DROP COLUMN "fees"`);
        await queryRunner.query(`ALTER TABLE "pay_pal_deposit" ADD "fees" character varying NOT NULL`);
    }

}
