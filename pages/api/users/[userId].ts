import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteUser,
  getUser,
  getValidSessionByToken,
  updateUser,
} from '../../../util/database';
import { Errors, UserType } from '../../../util/types';

export type UserResponse = { errors: Errors } | UserType | undefined;

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>,
) {
  const body = req.body;
  const query = req.query;
  const sessionToken = req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    res.status(404).send({
      errors: [{ message: 'You do not have a valid session.' }],
    });
    return;
  }

  if (session.userId !== Number(query.userId)) {
    res.status(404).send({
      errors: [{ message: 'You do not have permission or this action.' }],
    });
  }

  // get user
  if (req.method === 'GET') {
    const user = await getUser(Number(query.userId));
    return res.status(200).json(user);

    // delete user
  } else if (req.method === 'DELETE') {
    const deletedUser = await deleteUser(Number(query.userId));
    return res.status(200).json(deletedUser);

    // update user
  } else if (req.method === 'PATCH') {
    const updatedUser = await updateUser(Number(query.userId), {
      id: Number(query.userId),
      username: body.userName,
    });
    return res.status(200).json(updatedUser);
  }

  // 405 is code for method not allowed
  return res.status(405);
}
