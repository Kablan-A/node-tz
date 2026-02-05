import jwt from 'jsonwebtoken';

import { Role } from '../entity/Role.entity';
import { TokenPayload } from '../types/jwt';

const { ACCESS_SECRET, ACCESS_EXPIRATION, REFRESH_SECRET, REFRESH_EXPIRATION } = process.env;

export function generateTokens(userId: string, role: Role) {
  const payload: TokenPayload = { userId, role };

  const accessToken = jwt.sign(payload, ACCESS_SECRET!, {
    expiresIn: ACCESS_EXPIRATION,
  });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET!, {
    expiresIn: REFRESH_EXPIRATION,
  });

  return { accessToken, refreshToken };
}
