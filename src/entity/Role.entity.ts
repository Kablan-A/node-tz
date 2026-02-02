import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from "../enums/RoleType.enum";

@Entity({ name: "roles" })
export class Role {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column("enum", { enum: RoleType, unique: true })
	name!: RoleType;
}
