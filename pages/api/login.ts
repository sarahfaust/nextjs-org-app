import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyPassword } from '../../util/auth';
import { createTokenCookie } from '../../util/cookies';
import {
  createSession,
  deleteExpiredSessions,
  getUserWithPasswordHashByUsername,
} from '../../util/database';
import { Errors, UserType } from '../../util/types';

export type LoginResponse = { errors: Errors } | { user: UserType };

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>,
) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      errors: [{ message: 'Request does not contain username and password' }],
    });
    return;
  }

  try {
    const username = req.body.username;
    const userWithPasswordHash = await getUserWithPasswordHashByUsername(
      username,
    );

    // username is not in the database
    if (!userWithPasswordHash) {
      res.status(401).send({
        errors: [{ message: 'Username or password does not match.' }],
      });
      return;
    }

    const isPasswordCorrect = await verifyPassword(
      req.body.password,
      userWithPasswordHash.passwordHash,
    );

    if (!isPasswordCorrect) {
      res.status(401).send({
        errors: [{ message: 'Username or password does not match.' }],
      });
      return;
    }
    deleteExpiredSessions();

    // create a new token, set it in the database and create cookie
    const sessionToken = crypto.randomBytes(64).toString('base64');
    const newSession = await createSession(
      userWithPasswordHash.id,
      sessionToken,
    );
    const cookie = createTokenCookie(newSession.token);

    // remember to remove the pw-hash from the user object before returning
    const { passwordHash, ...user } = userWithPasswordHash;
    res.status(200).setHeader('Set-Cookie', cookie).send({ user: user });
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
