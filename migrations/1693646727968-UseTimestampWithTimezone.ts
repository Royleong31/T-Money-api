import { MigrationInterface, QueryRunner } from "typeorm";

export class UseTimestampWithTimezone1693646727968 implements MigrationInterface {
    name = 'UseTimestampWithTimezone1693646727968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_verification_sent_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_verification_sent_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email_verified" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email_verified" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_verification_sent_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_verification_sent_at" TIMESTAMP`);
    }

}
