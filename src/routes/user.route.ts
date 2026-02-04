import { Router } from 'express';

import { UserController } from '../controllers/user.controller';
import { RoleType } from '../enums/RoleType.enum';
import { authentication } from '../middleware/authentication.middleware';
import { authorization } from '../middleware/authorization.middleware';
import { checkOwnership } from '../middleware/check-ownership.middleware';

const router = Router();

router.get('', authentication, authorization([RoleType.ADMIN]), UserController.getAllUsers);

router.get(
  '/:userId',
  authentication,
  authorization([RoleType.ADMIN, RoleType.USER]),
  checkOwnership,
  UserController.getUser,
);

router.patch(
  '/:userId/toggle-active',
  authentication,
  authorization([RoleType.ADMIN]),
  UserController.toggleUserActiveStatus,
);

export { router as userRouter };
