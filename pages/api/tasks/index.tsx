import { NextApiRequest, NextApiResponse } from 'next';
import { createTask, getTasksByProfileId } from '../../../util/database';
import { Errors, TaskType } from '../../../util/types';

export type TasksResponse = { errors: Errors } | TaskType[] | TaskType;

export default async function tasksHandler(
  req: NextApiRequest,
  res: NextApiResponse<TasksResponse>,
) {
  const body = req.body;
  const cookies = req.cookies;
  const sessionToken = req.cookies.sessionToken;

  console.log('cookies', cookies);
  console.log('sessionToken', sessionToken);
  console.log('session id', sessionToken);

  // GET for all tasks
  if (req.method === 'GET') {
    // TODO: pass profile id to get only tasks connected to the profile
    // instead of all tasks in the database
    const tasks = await getTasksByProfileId(1);
    console.log('all the tasks', tasks);
    return res.status(200).json(tasks);

    // POST for new task
  } else if (req.method === 'POST') {
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
