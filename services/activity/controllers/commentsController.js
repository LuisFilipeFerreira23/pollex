import mongoose from 'mongoose';
import { Comment } from '../models/comment.js';

function getActorUserId(req, fallbackUserId) {
    return req.user?.id ? Number(req.user.id) : fallbackUserId ? Number(fallbackUserId) : null;
}

export async function getCommentsForUserId(req, res, next) {
    try {
        const { userId } = req.params;

        const commentsExist = await Comment.find({ userId }).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            message: 'Comments retrieved successfully',
            comments: commentsExist,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function getCommentsForTaskId(req, res, next) {
    try {
        const { taskId } = req.params;
        const limit = Number(req.query.limit || 20);

        const comments = await Comment.find({ taskId: Number(taskId) })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            message: 'Comments retrieved successfully',
            comments,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function deleteCommentsForTaskId(req, res, next) {
    try {
        const { taskId } = req.params;
        const parsedTaskId = Number(taskId);

        if (Number.isNaN(parsedTaskId)) {
            return res.status(400).json({ message: 'Invalid task id' });
        }

        const result = await Comment.deleteMany({ taskId: parsedTaskId });

        return res.status(200).json({
            message: 'Comments deleted successfully',
            deletedCount: result.deletedCount ?? 0,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function createComment(req, res, next) {
    try {
        const { content, taskId } = req.body;
        const userId = getActorUserId(req, req.body.userId);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const newComment = new Comment({
            content,
            taskId: Number(taskId),
            userId,
        });

        await newComment.save();

        return res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function editComment(req, res, next) {
    try {
        const { content, taskId } = req.body;
        const { id } = req.params;
        const userId = getActorUserId(req, req.body.userId);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid comment id. Use the MongoDB _id returned when the comment was created.',
            });
        }

        const updatedUser = await Comment.findByIdAndUpdate(
            id,
            {
                content,
                taskId: Number(taskId),
                userId,
            },
            { new: true, runValidators: true },
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        return res.status(201).json({ message: 'Comment updated successfully', comment: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function deleteComment(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid comment id. Use the MongoDB _id returned when the comment was created.',
            });
        }

        const updatedUser = await Comment.findByIdAndDelete(id);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        return res.status(201).json({ message: 'Comment deleted successfully', comment: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}
