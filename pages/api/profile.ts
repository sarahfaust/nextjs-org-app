import { NextApiRequest, NextApiResponse } from 'next';
import { getUser, getValidSessionByToken } from '../../util/database';
import { UserType } from '../../util/types';
import { SignupResponse } from './signup';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>,
) {
  if (req.method === 'GET') {
    const sessionToken = req.cookies.sessionToken;
    const session = await getValidSessionByToken(sessionToken);

    if (!session) {
      res.status(404).send({
        errors: [{ message: 'You do not have a valid session.' }],
      });
      return;
    }

    const user = (await getUser(session.userId)) as UserType | undefined;

    if (!user) {
      res.status(404).send({
        errors: [{ message: 'User not found.' }],
      });
      return;
    }
    return res.status(200).send({ user: user });
  }
  return res.status(405);
}
