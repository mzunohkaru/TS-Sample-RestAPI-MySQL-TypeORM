import { body, param } from "express-validator";

export const createPostValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage("Content must be between 1 and 10000 characters"),
];

export const updatePostValidation = [
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

export const idValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Post ID must be a positive integer"),
];
