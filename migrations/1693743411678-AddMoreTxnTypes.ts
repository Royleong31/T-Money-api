import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMoreTxnTypes1693743411678 implements MigrationInterface {
    name = 'AddMoreTxnTypes1693743411678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transaction_type_enum" RENAME TO "transaction_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('DEPOSIT', 'WITHDRAWAL', 'INTERNAL_TRANSFER_SENT', 'INTERNAL_TRANSFER_RECEIVED', 'MERCHANT_PAYMENT_RECEIVED', 'MERCHANT_PAYMENT_SENT', 'WITHDRAWAL_REFUND')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum" USING "type"::"text"::"public"."transaction_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum_old" AS ENUM('DEPOSIT', 'WITHDRAWAL', 'INTERNAL_TRANSFER_SENT', 'INTERNAL_TRANSFER_RECEIVED', 'MERCHANT_PAYMENT_RECEIVED', 'MERCHANT_PAYMENT_SENT')`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "type" TYPE "public"."transaction_type_enum_old" USING "type"::"text"::"public"."transaction_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_type_enum_old" RENAME TO "transaction_type_enum"`);
    }

}
