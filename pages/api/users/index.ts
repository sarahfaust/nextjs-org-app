import { NextApiRequest, NextApiResponse } from 'next';
import { getUsers } from '../../../util/database';
import { Errors, UserType } from '../../../util/types';

export type UsersReponse = { errors: Errors } | UserType[] | UserType;

export default async function usersHandler(
  req: NextApiRequest,
  res: NextApiResponse<UsersReponse>,
) {
  // GET for all users
  if (req.method === 'GET') {
    const users = await getUsers();
    return res.status(200).json(users);
  }

  return res.status(405);
}
