import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteSubtask,
  getSubtaskBySubtaskId,
  updateSubtask,
} from '../../../util/database';
import { Errors, SubtaskType } from '../../../util/types';

export type SubtaskResponse = { errors: Errors } | SubtaskType | undefined;

export default async function subtaskHandler(
  req: NextApiRequest,
  res: NextApiResponse<SubtaskResponse>,
) {
  const body = req.body;
  const query = req.query;

  // get task
  if (req.method === 'GET') {
    const subtask = await getSubtaskBySubtaskId(Number(query.taskId));
    return res.status(200).json(subtask);

    // delete task
  } else if (req.method === 'DELETE') {
    console.log('query', req.query);
    const deletedSubtask = await deleteSubtask(Number(query.subtaskId));
    return res.status(200).json(deletedSubtask);

    // update task
  } else if (req.method === 'PATCH') {
    const updatedSubtask = await updateSubtask(Number(query.subtaskId), {
      taskId: body.taskId,
      name: body.name,
      isDone: body.isDone,
    });
    return res.status(200).json(updatedSubtask);
  }

  // 405 is code for method not allowed
  return res.status(405);
}
