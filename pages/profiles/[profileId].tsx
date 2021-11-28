import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import { Edit2, Save, X } from 'react-feather';
import { ActionButton } from '../../components/ActionButton';
import {
  AppContainer,
  ButtonRow,
  Heading1,
  ProfileForm,
  ProfileInput,
  ProfileLabel,
} from '../../styles/styles';
import {
  getTimeStringFromDateObj,
  setTimeInDateObj,
} from '../../util/date-time';
import { Errors, ProfileType } from '../../util/types';

type Props = { profile: ProfileType };

export default function Profile(props: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [firstName, setFirstName] = useState(props.profile.firstName);
  const [lastName, setLastName] = useState(props.profile.lastName);
  const [location, setLocation] = useState(props.profile.location);
  const [timeStart, setTimeStart] = useState(
    getTimeStringFromDateObj(new Date(props.profile.timeStart)),
  );
  const [timeEnd, setTimeEnd] = useState(
    getTimeStringFromDateObj(new Date(props.profile.timeEnd)),
  );
  const [errors, setErrors] = useState<Errors>([]);

  function toggleEdit() {
    setIsEdit((prev) => !prev);
  }

  async function updateProfile(event: Event) {
    event.preventDefault();
    const response = await fetch(`/api/profiles/${props.profile.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.profile.userId,
        firstName: firstName,
        lastName: lastName,
        location: location,
        timeStart: setTimeInDateObj(timeStart),
        timeEnd: setTimeInDateObj(timeEnd),
      }),
    });

    const createProfile = await response.json();
    if ('errors' in createProfile) {
      setErrors(createProfile.errors);
      return;
    }

    toggleEdit();
  }

  function discardChanges(event: Event) {
    event.preventDefault();
    setFirstName(props.profile.firstName);
    setLastName(props.profile.lastName);
    setLocation(props.profile.location);
    setTimeStart(getTimeStringFromDateObj(new Date(props.profile.timeStart)));
    setTimeEnd(getTimeStringFromDateObj(new Date(props.profile.timeEnd)));
    toggleEdit();
  }

  return (
    <AppContainer>
      <ProfileForm>
        <Heading1>Profile settings</Heading1>
        <ProfileLabel>First name</ProfileLabel>
        <ProfileInput
          disabled={isEdit ? false : true}
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
        <ProfileLabel>Last name</ProfileLabel>
        <ProfileInput
          disabled={isEdit ? false : true}
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
        <ProfileLabel>Location</ProfileLabel>
        <ProfileInput
          disabled={isEdit ? false : true}
          value={location}
          onChange={(event) => setLocation(event.currentTarget.value)}
        />
        <ProfileLabel>I start at</ProfileLabel>
        <ProfileInput
          type="time"
          disabled={isEdit ? false : true}
          value={timeStart}
          onChange={(event) => setTimeStart(event.currentTarget.value)}
        />
        <ProfileLabel>I finish at</ProfileLabel>
        <ProfileInput
          type="time"
          disabled={isEdit ? false : true}
          value={timeEnd}
          onChange={(event) => setTimeEnd(event.currentTarget.value)}
        />
        {errors.length > 0 && (
          <div>
            {errors.map((error) => (
              <div key={`error-${error.message}`}>{error.message}</div>
            ))}
          </div>
        )}

        {isEdit ? (
          <ButtonRow>
            <ActionButton onClick={(event: Event) => updateProfile(event)}>
              <Save size={16} />
              Save changes
            </ActionButton>
            <ActionButton onClick={(event: Event) => discardChanges(event)}>
              <X size={16} />
              Discard changes
            </ActionButton>
          </ButtonRow>
        ) : (
          <ActionButton onClick={toggleEdit}>
            <Edit2 size={16} />
            Edit profile
          </ActionButton>
        )}
      </ProfileForm>
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidatedUserBySessionToken, getProfileByProfileId } =
    await import('../../util/database');

  const sessionToken = context.req.cookies.sessionToken;
  const validatedUser = await getValidatedUserBySessionToken(sessionToken);

  if (!validatedUser) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const profile = await getProfileByProfileId(Number(context.query.profileId));

  return {
    props: {
      profile: profile,
    },
  };
}
