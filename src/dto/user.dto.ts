import { UUID } from 'crypto';

import { Exclude } from 'class-transformer';

import { Role } from '../entity/Role.entity';

export class UserResponseDto {
  id!: UUID;
  fullName!: string;
  email!: string;
  dateOfBirth!: Date;
  role!: Role;

  @Exclude()
  password?: never;

  isActive!: boolean;
}
