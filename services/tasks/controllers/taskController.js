import dbmanager from '../database/dbmanager.js';
import { fn, col, Op } from 'sequelize';

const { Task, TaskActivity } = dbmanager;
const activityServiceUrl = process.env.INTERNAL_ACTIVITY_SERVICE_URL || 'http://api-activity:5175';
const defaultActivityLimit = 20;

function toPlain(record) {
    return record?.toJSON ? record.toJSON() : record;
}

function parseTaskId(taskId) {
    const parsedTaskId = Number(taskId);
    return Number.isNaN(parsedTaskId) ? taskId : parsedTaskId;
}

function normalizeValue(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }

    return value ?? null;
}

function getActorUserId(req) {
    return req.user?.id ? Number(req.user.id) : null;
}

async function fetchCommentsForTask(taskId, authorization) {
    try {
        const response = await fetch(`${activityServiceUrl}/comments/task/${taskId}`, {
            headers: authorization ? { Authorization: authorization } : {},
        });

        if (!response.ok) {
            return [];
        }

        const payload = await response.json();
        return payload.comments ?? payload.comment ?? [];
    } catch (error) {
        return [];
    }
}

async function deleteCommentsForTask(taskId, authorization) {
    const response = await fetch(`${activityServiceUrl}/comments/task/${taskId}`, {
        method: 'DELETE',
        headers: authorization ? { Authorization: authorization } : {},
    });

    if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.message || `Failed to delete comments for task ${taskId}`);
    }

    return response.json().catch(() => ({}));
}

async function recordTaskActivity({
    taskId,
    actorUserId,
    actionType,
    fieldName = null,
    oldValue = null,
    newValue = null,
    metadata = null,
}) {
    if (!TaskActivity || !actorUserId) {
        return null;
    }

    return TaskActivity.create({
        taskId,
        actorUserId,
        actionType,
        fieldName,
        oldValue,
        newValue,
        metadata,
    });
}

function buildTaskChanges(currentTask, incomingData) {
    const fields = ['title', 'description', 'status', 'dueDate', 'spaceId', 'documentationId'];

    return fields.reduce((changes, fieldName) => {
        if (incomingData[fieldName] === undefined) {
            return changes;
        }

        const nextValue = normalizeValue(incomingData[fieldName]);
        const currentValue = normalizeValue(currentTask.get(fieldName));

        if (JSON.stringify(currentValue) === JSON.stringify(nextValue)) {
            return changes;
        }

        changes[fieldName] = nextValue;
        return changes;
    }, {});
}

export async function getTasks(req, res, next) {
    try {
        const results = await Task.findAll({ limit: 10 });
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function getTaskById(req, res, next) {
    const { id } = req.params;
    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const [comments, activity] = await Promise.all([
            fetchCommentsForTask(id, req.headers.authorization),
            TaskActivity.findAll({
                where: { taskId: parseTaskId(id) },
                order: [['createdAt', 'DESC']],
                limit: defaultActivityLimit,
            }),
        ]);

        return res.status(200).json({
            ...toPlain(task),
            comments,
            activity: activity.map(toPlain),
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function addTask(req, res, next) {
    const { title, description, status, dueDate, spaceId, documentationId } = req.body;
    try {
        const actorUserId = getActorUserId(req);
        const results = await Task.create({
            title,
            description,
            status,
            dueDate,
            spaceId,
            documentationId,
        });

        await recordTaskActivity({
            taskId: results.id,
            actorUserId,
            actionType: 'task_created',
            newValue: toPlain(results),
        });

        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function updateTask(req, res, next) {
    const { id } = req.params;
    const actorUserId = getActorUserId(req);

    try {
        const currentTask = await Task.findByPk(id);

        if (!currentTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updates = buildTaskChanges(currentTask, req.body);

        if (Object.keys(updates).length === 0) {
            return res.status(200).json({ message: 'Task updated successfully' });
        }

        const previousValues = Object.fromEntries(
            Object.keys(updates).map((fieldName) => [fieldName, normalizeValue(currentTask.get(fieldName))]),
        );

        await currentTask.update(updates);

        await Promise.all(
            Object.entries(updates).map(([fieldName, newValue]) =>
                recordTaskActivity({
                    taskId: currentTask.id,
                    actorUserId,
                    actionType: fieldName === 'status' ? 'status_changed' : 'field_changed',
                    fieldName,
                    oldValue: previousValues[fieldName],
                    newValue,
                    metadata: fieldName === 'status' ? { status: newValue } : null,
                }),
            ),
        );

        return res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function getTaskActivityByTaskId(req, res) {
    try {
        const { id } = req.params;
        const limit = Number(req.query.limit || defaultActivityLimit);

        const activities = await TaskActivity.findAll({
            where: { taskId: parseTaskId(id) },
            order: [['createdAt', 'DESC']],
            limit,
        });

        return res.status(200).json({ activities: activities.map(toPlain) });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function getRecentTaskActivities(req, res) {
    try {
        const limit = Number(req.query.limit || defaultActivityLimit);

        const activities = await TaskActivity.findAll({
            order: [['createdAt', 'DESC']],
            limit,
        });

        return res.status(200).json({ activities: activities.map(toPlain) });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}

export async function getChartData(req, res) {
    try {
        const { days } = req.query;

        let whereClause = {};

        if (days && days !== 'all') {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(days));

            whereClause = {
                createdAt: {
                    [Op.gte]: startDate,
                },
            };
        }

        const tasks = await Task.findAll({
            where: whereClause,
            attributes: [[fn('DATE', col('createdAt')), 'date'], 'status', [fn('COUNT', col('id')), 'count']],
            group: [fn('DATE', col('createdAt')), 'status'],
            order: [[fn('DATE', col('createdAt')), 'ASC']],
        });

        const formattedData = tasks.reduce((acc, curr) => {
            const date = curr.get('date');
            const status = curr.status || 'todo';
            const count = parseInt(curr.get('count'));

            let dayEntry = acc.find((item) => item.date === date);

            if (!dayEntry) {
                dayEntry = { date, toDo: 0, doing: 0, done: 0 };
                acc.push(dayEntry);
            }

            if (status === 'completed' || status === 'done') dayEntry.done += count;
            else if (status === 'doing' || status === 'in_progress') dayEntry.doing += count;
            else dayEntry.toDo += count;

            return acc;
        }, []);

        return res.status(200).json(formattedData);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching chart data', error: error.message });
    }
}

export async function deleteTask(req, res, next) {
    const { id } = req.params;
    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await deleteCommentsForTask(task.id, req.headers.authorization);

        await Task.sequelize.transaction(async (transaction) => {
            await TaskActivity.destroy({ where: { taskId: task.id }, transaction });
            await Task.destroy({ where: { id }, transaction });
        });

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error:', error: error.message });
    }
}
