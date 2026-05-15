import { Comment } from '../models/comment.js';
import db from '../util/dbmanager.js';
const { User } = db;

function getActorUserId(req, fallbackUserId) {
    return req.user?.id ? Number(req.user.id) : fallbackUserId ? Number(fallbackUserId) : null;
}

export async function getCommentsForUserId(req, res, next) {
    try {
        const { userId } = req.params;

        const existsUser = await User.findOne({ where: { id: userId } });

        if (!existsUser) {
            return res.status(404).json({ message: 'User not found' });
        }

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

export async function createComment(req, res, next) {
    try {
        const { content, taskId } = req.body;
        const userId = getActorUserId(req, req.body.userId);

        const existsUser = await User.findOne({ where: { id: userId } });

        if (!existsUser) {
            res.status(404).json({ message: 'User not found' });
            return;
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

        const existsUser = await User.findOne({ where: { id: userId } });
        if (!existsUser) {
            return res.status(404).json({ message: 'User not found' });
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

        const updatedUser = await Comment.findByIdAndDelete(id);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        return res.status(201).json({ message: 'Comment deleted successfully', comment: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}
