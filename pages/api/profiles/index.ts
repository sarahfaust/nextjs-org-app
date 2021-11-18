import { NextApiRequest, NextApiResponse } from 'next';
import { createProfile } from '../../../util/database';
import { Errors, ProfileType } from '../../../util/types';

export type ProfilesReponse = { errors: Errors } | ProfileType;

export default async function profilesHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProfilesReponse>,
) {
  const body = req.body;
  console.log('profiles api');

  // POST for new profile
  if (req.method === 'POST') {
    console.log('creating profile in api', body);
    const profile = await createProfile({
      userId: body.userId,
      firstName: body.firstName,
      lastName: body.lastName,
      location: body.location,
      timeStart: body.timeStart,
      timeEnd: body.timeEnd,
    });

    if (!profile) {
      console.log('if');
      res
        .status(400)
        .send({ errors: [{ message: 'Profile could not be created.' }] });
      return;
    } else {
      console.log('else');
      return res.status(200).json(profile);
    }
  }

  return res.status(405);
}
