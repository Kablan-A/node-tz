import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { AuthLoginRequestDto, AuthRegisterRequestDto } from '../dto/auth.dto';
import { validateDto } from '../middleware/validate-dto.middleware';

const router = Router();

router.post('/register', validateDto(AuthRegisterRequestDto), AuthController.register);

router.post('/login', validateDto(AuthLoginRequestDto), AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

export { router as authRouter };
