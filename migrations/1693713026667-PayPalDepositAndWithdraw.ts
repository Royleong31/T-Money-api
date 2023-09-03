import { MigrationInterface, QueryRunner } from "typeorm";

export class PayPalDepositAndWithdraw1693713026667 implements MigrationInterface {
    name = 'PayPalDepositAndWithdraw1693713026667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pay_pal_withdraw" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paypal_payment_id" character varying, "currency" character varying NOT NULL, "amount" numeric NOT NULL, "user_id" uuid NOT NULL, "status" character varying NOT NULL, "fees" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_53c03c0566185724acdbe837223" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_72b779be485c899e1300a71e2a" ON "pay_pal_withdraw" ("paypal_payment_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_794506ba793d5d8890852e3220" ON "pay_pal_withdraw" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "pay_pal_deposit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paypal_checkout_id" character varying, "currency" character varying NOT NULL, "amount" numeric NOT NULL, "user_id" uuid NOT NULL, "fees" character varying NOT NULL, "status" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_897f92cd5cfb0c082afa374f650" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f1b12abca3fb87f966a255c9ca" ON "pay_pal_deposit" ("paypal_checkout_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7abb3c8bb4de01fff93597fb33" ON "pay_pal_deposit" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "pay_pal_withdraw" ADD CONSTRAINT "FK_794506ba793d5d8890852e32200" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pay_pal_deposit" ADD CONSTRAINT "FK_7abb3c8bb4de01fff93597fb33f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pay_pal_deposit" DROP CONSTRAINT "FK_7abb3c8bb4de01fff93597fb33f"`);
        await queryRunner.query(`ALTER TABLE "pay_pal_withdraw" DROP CONSTRAINT "FK_794506ba793d5d8890852e32200"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7abb3c8bb4de01fff93597fb33"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1b12abca3fb87f966a255c9ca"`);
        await queryRunner.query(`DROP TABLE "pay_pal_deposit"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_794506ba793d5d8890852e3220"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72b779be485c899e1300a71e2a"`);
        await queryRunner.query(`DROP TABLE "pay_pal_withdraw"`);
    }

}
