"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const postController = new postController_1.PostController();
const createPostValidation = [
    (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage('Content must be between 1 and 10000 characters'),
];
const updatePostValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Post ID must be a positive integer'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    (0, express_validator_1.body)('content')
        .optional()
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage('Content must be between 1 and 10000 characters'),
];
const idValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('Post ID must be a positive integer'),
];
router.get("/", postController.getAllPosts);
router.get("/:id", idValidation, validation_middleware_1.validationMiddleware, postController.getPostById);
router.post("/", auth_middleware_1.authMiddleware, createPostValidation, validation_middleware_1.validationMiddleware, postController.createPost);
router.put("/:id", auth_middleware_1.authMiddleware, updatePostValidation, validation_middleware_1.validationMiddleware, postController.updatePost);
router.delete("/:id", auth_middleware_1.authMiddleware, idValidation, validation_middleware_1.validationMiddleware, postController.deletePost);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map