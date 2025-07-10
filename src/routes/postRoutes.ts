import { Router } from "express";
import { PostController } from "../controllers/postController";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
  createPostValidation,
  updatePostValidation,
  idValidation,
} from "../validation/postValidation";

const router = Router();
const postController = new PostController();

router.get("/", optionalAuthMiddleware, postController.getAllPosts);
router.get(
  "/:id",
  optionalAuthMiddleware,
  idValidation,
  validationMiddleware,
  postController.getPostById
);
router.post(
  "/",
  authMiddleware,
  createPostValidation,
  validationMiddleware,
  postController.createPost
);
router.put(
  "/:id",
  authMiddleware,
  updatePostValidation,
  validationMiddleware,
  postController.updatePost
);
router.delete(
  "/:id",
  authMiddleware,
  idValidation,
  validationMiddleware,
  postController.deletePost
);

export default router;
