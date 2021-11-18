import { NextApiRequest, NextApiResponse } from 'next';
import { deleteUser, getUser, updateUser } from '../../../util/database';
import { UserType } from '../../../util/types';

export type UsersResponse = UserType | undefined;

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<UsersResponse>,
) {
  const body = req.body;
  const query = req.query;

  // get user
  if (req.method === 'GET') {
    const user = await getUser(Number(query.userId));
    return res.status(200).json(user);

    // delete user
  } else if (req.method === 'DELETE') {
    console.log('query', req.query);
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
