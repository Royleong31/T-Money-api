import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOtpSentDate1693922319953 implements MigrationInterface {
    name = 'AddOtpSentDate1693922319953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "otp_sent_date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp_sent_date"`);
    }

}
