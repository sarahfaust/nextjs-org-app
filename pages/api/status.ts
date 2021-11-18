import { NextApiRequest, NextApiResponse } from 'next';
import {
  getProfileByUserId,
  getUser,
  getValidSessionByToken,
} from '../../util/database';
import { Errors, ProfileType, UserType } from '../../util/types';

export type StatusResponse =
  | { errors: Errors }
  | { user: UserType; profile: ProfileType };

export default async function statusHandler(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse>,
) {
  if (req.method === 'GET') {
    const sessionToken = req.cookies.sessionToken;
    const session = await getValidSessionByToken(sessionToken);
    console.log('status session token', sessionToken);

    if (!session) {
      res.status(404).send({
        errors: [{ message: 'You do not have a valid session.' }],
      });
      return;
    }

    console.log('session valid', session);

    const user = (await getUser(session.userId)) as UserType | undefined;

    console.log('user valid', user);

    const profile = (await getProfileByUserId(session.userId)) as
      | ProfileType
      | undefined;

    console.log('status user and profile', user, profile);
    if (!user) {
      res.status(404).send({
        errors: [{ message: 'User not found.' }],
      });
      return;
    }

    if (!profile) {
      res.status(404).send({
        errors: [{ message: 'Profile not found.' }],
      });
      return;
    }

    return res.status(200).send({ user: user, profile: profile });
  }
  return res.status(405);
}