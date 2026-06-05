import Task from "../models/Task.js";
import User from "../models/User.js";

const publicTask = (task) => {
  const t = task.toObject ? task.toObject() : task;
  let responsable = t.responsable;
  if (responsable && typeof responsable === "object" && responsable._id) {
    responsable = {
      id: responsable._id,
      name: responsable.name,
      email: responsable.email,
    };
  }
  return {
    id: t._id,
    title: t.title,
    description: t.description,
    completed: t.completed,
    responsable,
    owner: t.owner,
  };
};

export const createTaskController = async (req, res, next) => {
  try {
    const { title, description, responsable } = req.body;
    if (responsable) {
      const user = await User.findById(responsable);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Responsible not found" });
      }
    }
    const task = await Task.create({
      title,
      description,
      responsable: responsable || null,
      owner: req.userId,
    });
    res
      .status(201)
      .json({ success: true, message: "Task created", data: publicTask(task) });
  } catch (err) {
    next(err);
  }
};

export const listTasksController = async (req, res, next) => {
  try {
    const filter = req.userRole === "admin" ? {} : { responsable: req.userId };
    const tasks = await Task.find(filter).populate("responsable", "name email");
    res.json({
      success: true,
      message: "Tasks retrieved",
      data: tasks.map(publicTask),
    });
  } catch (err) {
    next(err);
  }
};

export const completeTaskController = async (req, res, next) => {
  try {
    const { completed } = req.body;
    const newCompleted = typeof completed === "boolean" ? completed : true;
    if (newCompleted === false && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admin can reopen tasks" });
    }
    const filter =
      req.userRole === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, responsable: req.userId };
    const task = await Task.findOneAndUpdate(
      filter,
      { completed: newCompleted },
      { returnDocument: "after" },
    );
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.json({
      success: true,
      message: newCompleted ? "Task completed" : "Task marked pending",
      data: publicTask(task),
    });
  } catch (err) {
    next(err);
  }
};

export const assignTaskController = async (req, res, next) => {
  try {
    const { responsable } = req.body;
    const user = await User.findById(responsable);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Responsible not found" });
    }
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { responsable },
      { returnDocument: "after" },
    );
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.json({
      success: true,
      message: "Responsible assigned",
      data: publicTask(task),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
