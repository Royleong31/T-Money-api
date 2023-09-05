import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeOtpSendDateTimestampz1693922774651 implements MigrationInterface {
    name = 'MakeOtpSendDateTimestampz1693922774651'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp_sent_date"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otp_sent_date" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp_sent_date"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otp_sent_date" TIMESTAMP`);
    }

}
