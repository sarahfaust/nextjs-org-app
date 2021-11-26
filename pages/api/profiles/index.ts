import { NextApiRequest, NextApiResponse } from 'next';
import { createProfile } from '../../../util/database';
import { Errors, ProfileType } from '../../../util/types';

export type ProfilesReponse = { errors: Errors } | ProfileType;

export default async function profilesHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProfilesReponse>,
) {
  const body = req.body;

  // POST for new profile
  if (req.method === 'POST') {
    const profile = await createProfile({
      userId: body.userId,
      firstName: body.firstName,
      lastName: body.lastName,
      location: body.location,
      timeStart: body.timeStart,
      timeEnd: body.timeEnd,
    });

    if (!profile) {
      res
        .status(400)
        .send({ errors: [{ message: 'Profile could not be created.' }] });
      return;
    } else {
      return res.status(200).json(profile);
    }
  }

  return res.status(405);
}
