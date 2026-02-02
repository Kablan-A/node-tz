import { MigrationInterface, QueryRunner } from "typeorm";
import { RoleType } from "../enums/RoleType.enum";

export class SeedRoles1770056620652 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`INSERT INTO "roles"("name") VALUES ('${RoleType.USER}'), ('${RoleType.ADMIN}')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DELETE FROM "roles" WHERE "name" IN ('${RoleType.USER}', '${RoleType.ADMIN}')`,
		);
	}
}
