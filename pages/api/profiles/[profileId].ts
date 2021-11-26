import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteProfile,
  getProfileByUserId,
  updateProfile,
} from '../../../util/database';
import { Errors, ProfileType } from '../../../util/types';

export type ProfileRequest = {
  userId: number;
  firstName: string;
  lastName: string;
  location: string;
  timeStart: Date;
  timeEnd: Date;
};

export type ProfileResponse = { errors: Errors } | ProfileType | undefined;

export default async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProfileResponse>,
) {
  const body = req.body;
  const query = req.query;

  // get profile
  if (req.method === 'GET') {
    const profile = await getProfileByUserId(Number(query.profileId));
    return res.status(200).json(profile);

    // delete profile
  } else if (req.method === 'DELETE') {
    const deletedProfile = await deleteProfile(Number(req.query.profileId));
    return res.status(200).json(deletedProfile);

    // update profile
  } else if (req.method === 'PATCH') {
    const updatedProfile = await updateProfile(Number(query.profileId), {
      userId: Number(body.userId),
      firstName: body.firstName,
      lastName: body.lastName,
      location: body.location,
      timeStart: body.timeStart,
      timeEnd: body.timeEnd,
    });
    return res.status(200).json(updatedProfile);
  }

  // 405 is code for method not allowed
  return res.status(405);
}
