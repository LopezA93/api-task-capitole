import User from "../models/User.js";
import Task from "../models/Task.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email role");
    res.json({
      success: true,
      message: "Users retrieved",
      data: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }
      user.email = email;
    }
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (password) user.password = password;
    await user.save();
    res.json({
      success: true,
      message: "User updated",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.userId.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "No podés eliminar tu propia cuenta",
      });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await Task.updateMany(
      { responsable: req.params.id },
      { responsable: null },
    );
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
