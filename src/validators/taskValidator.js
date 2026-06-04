import { body, param } from "express-validator";

export const createTaskValidation = [
  body("title").trim().notEmpty().withMessage("title required"),
  body("responsable").optional().isMongoId().withMessage("invalid responsable"),
];

export const assignValidation = [
  param("id").isMongoId().withMessage("invalid id"),
  body("responsable").isMongoId().withMessage("invalid responsable"),
];

export const idValidation = [param("id").isMongoId().withMessage("invalid id")];
