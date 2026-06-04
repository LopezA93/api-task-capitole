import { body } from "express-validator";

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("name required"),
  body("email").isEmail().withMessage("invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password minimum 6 characters"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("invalid email"),
  body("password").notEmpty().withMessage("password required"),
];

export const refreshValidation = [
  body("refreshToken").notEmpty().withMessage("refreshToken required"),
];
