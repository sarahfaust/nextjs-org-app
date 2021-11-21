import { NextApiRequest, NextApiResponse } from 'next';
import { createSubtask, getSubtasksByTaskId } from '../../../util/database';
import { Errors, SubtaskType } from '../../../util/types';

export type SubtasksResponse = { errors: Errors } | SubtaskType[] | SubtaskType;

export default async function subtasksHandler(
  req: NextApiRequest,
  res: NextApiResponse<SubtasksResponse>,
) {
  const body = req.body;

  // GET for all subtasks
  if (req.method === 'GET') {
    const subtasks = await getSubtasksByTaskId(1);
    return res.status(200).json(subtasks);

    // POST for new subtask
  } else if (req.method === 'POST') {
    const subtask = await createSubtask({
      taskId: body.taskId,
      name: body.name,
      isDone: body.isDone,
    });

    if (!subtask) {
      res
        .status(400)
        .send({ errors: [{ message: 'Subtask could not be created.' }] });
      return;
    } else {
      return res.status(200).json(subtask);
    }
  }

  return res.status(405);
}
