import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1693586903398 implements MigrationInterface {
  name = 'CreateUsers1693586903398';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "date_of_birth" character varying NOT NULL, "country" character varying NOT NULL, "postcode" character varying NOT NULL, "occupation" character varying NOT NULL, "user_id" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_59c55ac40f267d450246040899" UNIQUE ("user_id"), CONSTRAINT "PK_273a06d6cdc2085ee1ce7638b24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "email_verification_sent_at" TIMESTAMP, "email_verified" boolean, "otp_counter" integer NOT NULL DEFAULT '0', "otp_secret" character varying NOT NULL, "failed_otp_attempts" integer NOT NULL DEFAULT '0', "account_type" character varying NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d091f1d36f18bbece2a9eabc6e" ON "user" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "business_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "uen" character varying NOT NULL, "country" character varying NOT NULL, "postal_code" character varying NOT NULL, "address" character varying NOT NULL, "user_id" uuid NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_dea50d6f2751314dc95cd54c13" UNIQUE ("user_id"), CONSTRAINT "PK_6208c6d556fc13e83f87d520dee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_info" ADD CONSTRAINT "FK_59c55ac40f267d450246040899e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_info" ADD CONSTRAINT "FK_dea50d6f2751314dc95cd54c13d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_info" DROP CONSTRAINT "FK_dea50d6f2751314dc95cd54c13d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_info" DROP CONSTRAINT "FK_59c55ac40f267d450246040899e"`,
    );
    await queryRunner.query(`DROP TABLE "business_info"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d091f1d36f18bbece2a9eabc6e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_info"`);
  }
}
