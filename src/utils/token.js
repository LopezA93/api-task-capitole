import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import RefreshToken from "../models/RefreshToken.js";

export const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRED || "2h",
  });

export const createRefreshToken = async (userId) => {
  const token = randomUUID();
  const days = Number(process.env.REFRESH_TOKEN_EXPIRED || 7);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ token, user: userId, expiresAt });
  return token;
};
