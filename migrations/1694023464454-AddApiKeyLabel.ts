import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApiKeyLabel1694023464454 implements MigrationInterface {
    name = 'AddApiKeyLabel1694023464454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" ADD "label" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" DROP COLUMN "label"`);
    }

}
