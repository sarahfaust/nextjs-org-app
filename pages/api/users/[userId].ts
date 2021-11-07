import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteUserById,
  getUser,
  updateUserById,
} from '../../../util/database';
import { UserType } from '../../../util/types';

export type UsersResponse = UserType | undefined;

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse>,
) {
  console.log('query', req.query);
  // console.log('body', req.body);
  // console.log('method', req.method);

  if (req.method === 'GET') {
    const user = await getUser(Number(req.query.userId));

    return res.status(200).json(user);
  } else if (req.method === 'DELETE') {
    console.log('query', req.query);
    // the code for the POST request
    const deletedUser = await deleteUserById(Number(req.query.userId));

    return res.status(200).json(deletedUser);
  } else if (req.method === 'PATCH') {
    const body = req.body;
    const query = req.query;
    const updatedUser = await updateUserById(Number(query.userId), {
      id: Number(query.userId),
      username: body.userName,
    });

    return res.status(200).json(updatedUser);
  }

  return res.status(405);
}
