import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCustomerIdInMerchantNullable1693757052885 implements MigrationInterface {
    name = 'MakeCustomerIdInMerchantNullable1693757052885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ALTER COLUMN "customer_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "merchant_payment" DROP CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037"`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ALTER COLUMN "customer_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "merchant_payment" ADD CONSTRAINT "FK_07fb179c0c2c071eb8f644ef037" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
