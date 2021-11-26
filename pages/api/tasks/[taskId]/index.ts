import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteTask,
  getProfileBySessionToken,
  getTaskByTaskIdAndProfileId,
  getValidSessionByToken,
  updateTask,
} from '../../../../util/database';
import { Errors, TaskType } from '../../../../util/types';

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
  const sessionToken = req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const profile = await getProfileBySessionToken(sessionToken);

  if (!session) {
    return res.status(404).send({
      errors: [{ message: 'You do not have a valid session.' }],
    });
  }

  if (!profile) {
    return res.status(404).send({
      errors: [
        {
          message: 'You do not have permission for this action.',
        },
      ],
    });
  }

  // get task
  if (req.method === 'GET') {
    const task = await getTaskByTaskIdAndProfileId(
      Number(query.taskId),
      profile.id,
    );
    return res.status(200).json(task);

    // delete task
  } else if (req.method === 'DELETE') {
    const deletedTask = await deleteTask(Number(query.taskId));
    return res.status(200).json(deletedTask);

    // update task
  } else if (req.method === 'PATCH') {
    if (body.profileId !== profile.id) {
      return res.status(404).send({
        errors: [{ message: 'You do not have permission for this action.' }],
      });
    }

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
