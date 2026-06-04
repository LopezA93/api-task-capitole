import { body, param } from "express-validator";

export const createUserValidation = [
  body("name").trim().notEmpty().withMessage("name required"),
  body("email").isEmail().withMessage("invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password minimum 6 characters"),
  body("role").optional().isIn(["user", "admin"]).withMessage("invalid role"),
];

export const updateUserValidation = [
  param("id").isMongoId().withMessage("invalid id"),
  body("name").optional().trim().notEmpty().withMessage("name required"),
  body("email").optional().isEmail().withMessage("invalid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password minimum 6 characters"),
  body("role").optional().isIn(["user", "admin"]).withMessage("invalid role"),
];

export const idValidation = [
  param("id").isMongoId().withMessage("invalid id"),
];
