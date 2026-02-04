import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndRoleTables1770056620651 implements MigrationInterface {
  name = 'CreateUserAndRoleTables1770056620651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('USER', 'ADMIN')`);
    await queryRunner.query(
      `CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" "public"."roles_name_enum" NOT NULL,
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "fullName" text NOT NULL,
                "dateOfBirth" date NOT NULL,
                "email" text NOT NULL,
                "password" text NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "roleId" uuid,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )`,
    );
    await queryRunner.query(
      `ALTER TABLE "users"
            ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"
            FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users"
            DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
  }
}
