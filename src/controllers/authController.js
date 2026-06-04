import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { signAccessToken, createRefreshToken } from "../utils/token.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    const accessToken = signAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);
    res.status(201).json({
      success: true,
      message: "User registered",
      data: { accessToken, refreshToken, user: publicUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const accessToken = signAccessToken(user._id);
    const refreshToken = await createRefreshToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      data: { accessToken, refreshToken, user: publicUser(user) },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await stored.deleteOne();
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
    await stored.deleteOne();
    const accessToken = signAccessToken(stored.user);
    const newRefresh = await createRefreshToken(stored.user);
    res.json({
      success: true,
      message: "Token refreshed",
      data: { accessToken, refreshToken: newRefresh },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ success: true, message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};
