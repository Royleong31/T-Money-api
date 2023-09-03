import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransfersTables1693731498411 implements MigrationInterface {
    name = 'AddTransfersTables1693731498411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "internal_transfer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sender_id" uuid NOT NULL, "amount" numeric NOT NULL, "currency" character varying NOT NULL, "receiver_id" uuid NOT NULL, "note" character varying NOT NULL DEFAULT '', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "transactions_id" uuid, CONSTRAINT "REL_b7785437a30667a6550adce9eb" UNIQUE ("sender_id"), CONSTRAINT "REL_a2c73ed74a01d6a91f7b8996b9" UNIQUE ("receiver_id"), CONSTRAINT "PK_7a6759287eb81db201fdac4e18d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b7785437a30667a6550adce9eb" ON "internal_transfer" ("sender_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2c73ed74a01d6a91f7b8996b9" ON "internal_transfer" ("receiver_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a73ea7c8b5747c3783322dbe3" ON "internal_transfer" ("created_at") `);
        await queryRunner.query(`CREATE TABLE "merchant_payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" character varying NOT NULL, "customer_id" uuid NOT NULL, "merchant_id" uuid NOT NULL, "amount" numeric NOT NULL, "currency" character varying NOT NULL, "merchant_payment_status" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ac53f2fd0a1afdd8dca179fa79b" UNIQUE ("order_id", "merchant_id"), CONSTRAINT "REL_07fb179c0c2c071eb8f644ef03" UNIQUE ("customer_id"), CONSTRAINT "REL_e4be6615da3f10ee16a8d14f22" UNIQUE ("merchant_id"), CONSTRAINT "PK_7f42978795ebf288a908d7968e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_07fb179c0c2c071eb8f644ef03" ON "merchant_payment" ("customer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e4be6615da3f10ee16a8d14f22" ON "merchant_payment" ("merchant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2db75836b28a19569f721cbc67" ON "merchant_payment" ("created_at") `);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('DEPOSIT', 'WITHDRAWAL', 'INTERNAL_TRANSFER_SENT', 'INTERNAL_TRANSFER_RECEIVED', 'MERCHANT_PAYMENT_RECEIVED', 'MERCHANT_PAYMENT_SENT')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "currency" character varying NOT NULL, "amount" numeric NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "internal_transfer_id" uuid, "paypal_deposit_id" uuid, "paypal_withdrawal_id" uuid, "merchant_payment_id" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_8903e641332620b00a657b7d9a" UNIQUE ("paypal_deposit_id"), CONSTRAINT "REL_fb00b3505122df2e1567470f97" UNIQUE ("paypal_withdrawal_id"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b4a3d92d5dde30f3ab5c34c586" ON "transaction" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "FK_b7785437a30667a6550adce9ebf" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "FK_a2c73ed74a01d6a91f7b8996b9f" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "FK_f140d32d62e6c349c52bdb696ce" FOREIGN KEY ("transactions_id") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_e4be6615da3f10ee16a8d14f22e" FOREIGN KEY ("merchant_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_55aea6394dde3145aa2c2d4f156" FOREIGN KEY ("internal_transfer_id") REFERENCES "internal_transfer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_8903e641332620b00a657b7d9a6" FOREIGN KEY ("paypal_deposit_id") REFERENCES "pay_pal_deposit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_fb00b3505122df2e1567470f973" FOREIGN KEY ("paypal_withdrawal_id") REFERENCES "pay_pal_withdraw"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_1207c1cce7d46d4595afafa86cd" FOREIGN KEY ("merchant_payment_id") REFERENCES "merchant_payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_1207c1cce7d46d4595afafa86cd"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_fb00b3505122df2e1567470f973"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_8903e641332620b00a657b7d9a6"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_55aea6394dde3145aa2c2d4f156"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_e4be6615da3f10ee16a8d14f22e"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "FK_f140d32d62e6c349c52bdb696ce"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "FK_a2c73ed74a01d6a91f7b8996b9f"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "FK_b7785437a30667a6550adce9ebf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4a3d92d5dde30f3ab5c34c586"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2db75836b28a19569f721cbc67"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4be6615da3f10ee16a8d14f22"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_07fb179c0c2c071eb8f644ef03"`);
        await queryRunner.query(`DROP TABLE "merchant_payment"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a73ea7c8b5747c3783322dbe3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2c73ed74a01d6a91f7b8996b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7785437a30667a6550adce9eb"`);
        await queryRunner.query(`DROP TABLE "internal_transfer"`);
    }

}
