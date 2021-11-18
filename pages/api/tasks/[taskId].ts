import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteTask,
  getTaskByTaskId,
  updateTask,
} from '../../../util/database';
import { Errors, TaskType } from '../../../util/types';

export type TaskRequest = {
  profileId: number;
  name: string;
  isDone: boolean;
  isToday: boolean;
};

export type TaskResponse = { errors: Errors } | TaskType | undefined;

export default async function taskHandler(
  req: NextApiRequest,
  res: NextApiResponse<TaskResponse>,
) {
  const body = req.body;
  const query = req.query;

  // get task
  if (req.method === 'GET') {
    const task = await getTaskByTaskId(Number(query.taskId));
    return res.status(200).json(task);

    // delete task
  } else if (req.method === 'DELETE') {
    console.log('query', req.query);
    const deletedTask = await deleteTask(Number(query.taskId));
    return res.status(200).json(deletedTask);

    // update task
  } else if (req.method === 'PATCH') {
    const updatedTask = await updateTask(Number(query.taskId), {
      profileId: body.profileId,
      name: body.name,
      isDone: body.isDone,
      isToday: body.isToday,
    });
    return res.status(200).json(updatedTask);
  }

  // 405 is code for method not allowed
  return res.status(405);
}
