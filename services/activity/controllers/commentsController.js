import { Comment } from "../models/activity.js";
import db from "../util/dbmanager.js";
const { User } = db;

export function getCommentsForUserId(req, res, next) {
  try {
    const { userId } = req.params;

    const existsUser = User.findOne({ where: { id: userId } });

    if (!existsUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const commentsExist = Comment.findOne({ userId });

    if (!commentsExist) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({
      message: "Comments retrieved successfully",
      comment: commentsExist,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function createComment(req, res, next) {
  try {
    const { content, taskId, userId } = req.body;

    const existsUser = User.findOne({ where: { id: userId } });

    if (!existsUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newComment = new Comment({
      content,
      taskId,
      userId,
    });

    await newComment.save();

    return res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export async function editComment(req, res, next) {
  try {
    const { content, taskId, userId } = req.body;
    const { id } = req.params;

    const existsUser = await User.findOne({ where: { id: userId } });
    if (!existsUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await Comment.findByIdAndUpdate(
      { _id: id },
      {
        content,
        taskId,
        userId,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res
      .status(201)
      .json({ message: "Comment updated successfully", comment: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}

export function deleteComment(req, res, next) {
  try {
    const { id } = req.params;

    const updatedUser = Comment.findByIdAndUpdate({ _id: id });

    if (!updatedUser) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res
      .status(201)
      .json({ message: "Comment deleted successfully", comment: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Error:", error: error.message });
  }
}
