import { Notification } from '../models/notification.js';

export async function getNotifsForUser(req, res, next) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const notificationsExist = await Notification.find({ userId: Number(userId) })
            .sort({ createdAt: -1 })
            .lean();

        if (!notificationsExist || notificationsExist.length === 0) {
            return res.status(404).json({ message: 'Notifications not found' });
        }

        return res.status(200).json({
            message: 'Notifications retrieved successfully',
            notifications: notificationsExist,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function createNotifs(req, res, next) {
    try {
        const { message, type } = req.body;
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const newNotification = new Notification({
            userId: Number(userId),
            message,
            type: Number(type),
            isRead: false,
        });

        await newNotification.save();

        return res.status(201).json({
            message: 'Notification created successfully',
            notification: newNotification,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

/* 
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
*/
