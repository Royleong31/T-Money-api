import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOneToOneToManyToOne1693759252660 implements MigrationInterface {
    name = 'ChangeOneToOneToManyToOne1693759252660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "FK_b7785437a30667a6550adce9ebf"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "FK_a2c73ed74a01d6a91f7b8996b9f"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "REL_b7785437a30667a6550adce9eb"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "REL_a2c73ed74a01d6a91f7b8996b9"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_e4be6615da3f10ee16a8d14f22e"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "UQ_ac53f2fd0a1afdd8dca179fa79b"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "REL_07fb179c0c2c071eb8f644ef03"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "REL_e4be6615da3f10ee16a8d14f22"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "UQ_ac53f2fd0a1afdd8dca179fa79b" UNIQUE ("order_id", "merchant_id")`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "FK_b7785437a30667a6550adce9ebf" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "FK_a2c73ed74a01d6a91f7b8996b9f" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_e4be6615da3f10ee16a8d14f22e" FOREIGN KEY ("merchant_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_e4be6615da3f10ee16a8d14f22e"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "FK_a2c73ed74a01d6a91f7b8996b9f"`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" DROP CONSTRAINT "FK_b7785437a30667a6550adce9ebf"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "UQ_ac53f2fd0a1afdd8dca179fa79b"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "REL_e4be6615da3f10ee16a8d14f22" UNIQUE ("merchant_id")`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "REL_07fb179c0c2c071eb8f644ef03" UNIQUE ("customer_id")`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "UQ_ac53f2fd0a1afdd8dca179fa79b" UNIQUE ("order_id", "merchant_id")`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_e4be6615da3f10ee16a8d14f22e" FOREIGN KEY ("merchant_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "REL_a2c73ed74a01d6a91f7b8996b9" UNIQUE ("receiver_id")`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "REL_b7785437a30667a6550adce9eb" UNIQUE ("sender_id")`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "FK_a2c73ed74a01d6a91f7b8996b9f" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "internal_transfer" ADD CONSTRAINT "FK_b7785437a30667a6550adce9ebf" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
