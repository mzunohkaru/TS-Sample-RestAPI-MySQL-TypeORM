import { Router } from "express";
import { PostController } from "../controllers/postController";
import { authMiddleware } from "../middleware/auth.middleware";
import { body, param } from "express-validator";
import { validationMiddleware } from "../middleware/validation.middleware";

const router = Router();
const postController = new PostController();

const createPostValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Content must be between 1 and 10000 characters"),
];

const updatePostValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a positive integer"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Content must be between 1 and 10000 characters"),
];

const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a positive integer"),
];

router.get("/", postController.getAllPosts);
router.get(
  "/:id",
  idValidation,
  validationMiddleware,
  postController.getPostById,
);
router.post(
  "/",
  authMiddleware,
  createPostValidation,
  validationMiddleware,
  postController.createPost,
);
router.put(
  "/:id",
  authMiddleware,
  updatePostValidation,
  validationMiddleware,
  postController.updatePost,
);
router.delete(
  "/:id",
  authMiddleware,
  idValidation,
  validationMiddleware,
  postController.deletePost,
);

export default router;
