import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./Role.entity";

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column("text")
	fullName!: string;

	@Column("date")
	dateOfBirth!: Date;

	@Column("text", { unique: true })
	email!: string;

	@Column("text")
	password!: string;

	@ManyToOne(() => Role)
	role!: Role;

	@Column("bool", { default: true })
	isActive!: boolean;
}
