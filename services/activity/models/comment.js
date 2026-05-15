'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        content: { type: String, required: true },
        taskId: { type: Number, required: true, index: true },
        userId: { type: Number, required: true },
    },
    { collection: 'comments', timestamps: true },
);

export const Comment = mongoose.model('Comment', commentSchema);
