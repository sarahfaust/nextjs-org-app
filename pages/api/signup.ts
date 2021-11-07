import crypto from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword } from '../../util/auth';
import { createTokenCookie } from '../../util/cookies';
import { verifyCsrfToken } from '../../util/csrf';
import {
  createSession,
  createUser,
  deleteExpiredSessions,
  getUserWithPasswordHashByUsername,
} from '../../util/database';
import { Errors, UserType } from '../../util/types';

export type SignupRequest = {
  username: string;
  password: string;
};

export type SignupResponse = { errors: Errors } | { user: UserType };

export default async function signupHandler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>,
) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      errors: [{ message: 'Request does not contain username and password.' }],
    });
    return;
  }

  if (!req.body.csrfToken || !verifyCsrfToken(req.body.csrfToken)) {
    res.status(400).send({
      errors: [{ message: 'Request does not contain valid CSRF token.' }],
    });
    return;
  }

  try {
    const username = req.body.username;
    const existingUser = await getUserWithPasswordHashByUsername(username);

    if (existingUser) {
      res.status(400).send({
        errors: [{ message: 'This username is already taken.' }],
      });
      return;
    }

    const passwordHash = await hashPassword(req.body.password);
    const user = await createUser({
      username: username,
      passwordHash: passwordHash,
    });

    deleteExpiredSessions();

    if (!user) {
      res
        .status(500)
        .send({ errors: [{ message: 'User could not be created.' }] });
      return;
    }

    const sessionToken = crypto.randomBytes(64).toString('base64');
    const newSession = await createSession(user.id, sessionToken);
    const cookie = createTokenCookie(newSession.token);

    res.status(200).setHeader('set-Cookie', cookie).send({ user: user });
  } catch (err) {
    res.status(500).send({ errors: [{ message: (err as Error).message }] });
  }
}
