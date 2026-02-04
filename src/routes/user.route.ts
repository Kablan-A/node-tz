import { Router } from "express";
import { authentication } from "../middleware/authentication.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { RoleType } from "../enums/RoleType.enum";
import { checkOwnership } from "../middleware/check-ownership.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.get(
	"",
	authentication,
	authorization([RoleType.ADMIN]),
	UserController.getAllUsers,
);

router.get(
	"/:userId",
	authentication,
	authorization([RoleType.ADMIN, RoleType.USER]),
	checkOwnership,
	UserController.getUser,
);

router.patch(
	"/:userId/toggle-active",
	authentication,
	authorization([RoleType.ADMIN]),
	UserController.toggleUserActiveStatus,
);

export { router as userRouter };
