import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteSubtask,
  getProfileBySessionToken,
  getSubtaskBySubtaskId,
  getValidSessionByToken,
  updateSubtask,
} from '../../../../../util/database';
import { Errors, SubtaskType } from '../../../../../util/types';

export type SubtaskResponse = { errors: Errors } | SubtaskType | undefined;

export default async function subtaskHandler(
  req: NextApiRequest,
  res: NextApiResponse<SubtaskResponse>,
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
      errors: [{ message: 'You do not have permission for this action.' }],
    });
  }

  // get task
  if (req.method === 'GET') {
    const subtask = await getSubtaskBySubtaskId(Number(query.taskId));
    return res.status(200).json(subtask);

    // delete task
  } else if (req.method === 'DELETE') {
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
