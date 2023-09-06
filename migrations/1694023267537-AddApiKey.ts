import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApiKey1694023267537 implements MigrationInterface {
    name = 'AddApiKey1694023267537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."api_key_type_enum" AS ENUM('CREATE_PAYMENT_QR')`);
        await queryRunner.query(`CREATE TABLE "api_key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashed_secret" character varying NOT NULL, "merchant_id" uuid NOT NULL, "type" "public"."api_key_type_enum" NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1f9ae54495db65d0f858df4973" ON "api_key" ("created_at") `);
        await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_4505fadbecfd29c0a6848e9b392" FOREIGN KEY ("merchant_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_4505fadbecfd29c0a6848e9b392"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f9ae54495db65d0f858df4973"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
        await queryRunner.query(`DROP TYPE "public"."api_key_type_enum"`);
    }

}
