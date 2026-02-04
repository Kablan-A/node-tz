import { JwtPayload } from 'jsonwebtoken';

import { Role } from '../entity/Role.entity';

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: Role;
}
