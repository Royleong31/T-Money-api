import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDefault1694186427911 implements MigrationInterface {
    name = 'RemoveDefault1694186427911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" ALTER COLUMN "webhook_url" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" ALTER COLUMN "webhook_url" SET DEFAULT ''`);
    }

}
