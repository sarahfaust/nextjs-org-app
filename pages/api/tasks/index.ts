import { NextApiRequest, NextApiResponse } from 'next';
import {
  createTask,
  getProfileBySessionToken,
  getTasksByProfileId,
  getValidSessionByToken,
} from '../../../util/database';
import { Errors, TaskType } from '../../../util/types';

export type TasksResponse = { errors: Errors } | TaskType[] | TaskType;

export default async function tasksHandler(
  req: NextApiRequest,
  res: NextApiResponse<TasksResponse>,
) {
  const body = req.body;
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
      errors: [{ message: 'You do not have permission for this action.' }],
    });
  }

  // GET for all tasks
  if (req.method === 'GET') {
    const tasks = await getTasksByProfileId(profile.id);
    return res.status(200).json(tasks);

    // POST for new task
  } else if (req.method === 'POST') {
    if (body.profileId !== profile.id) {
      return res.status(404).send({
        errors: [
          {
            message: 'You do not have permission for this action.',
          },
        ],
      });
    }

    const task = await createTask({
      profileId: body.profileId,
      name: body.name,
      isDone: body.isDone,
      isToday: body.isToday,
    });

    if (!task) {
      res
        .status(400)
        .send({ errors: [{ message: 'Task could not be created.' }] });
      return;
    } else {
      return res.status(200).json(task);
    }
  }

  return res.status(405);
}
