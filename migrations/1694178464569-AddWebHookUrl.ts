import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebHookUrl1694178464569 implements MigrationInterface {
    name = 'AddWebHookUrl1694178464569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" ADD "webhook_url" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" DROP COLUMN "webhook_url"`);
    }

}
