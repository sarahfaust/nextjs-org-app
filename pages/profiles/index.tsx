import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
// import { useRouter } from 'next/dist/client/router';
import { Button } from '../../components/Button';
import {
  AppContainer,
  Heading1,
  ProfileForm,
  ProfileInput,
  ProfileLabel,
} from '../../styles/styles';
import { useAuthContext } from '../../util/auth-context';
import { setTimeInDateObj } from '../../util/date-time';
import { Errors } from '../../util/types';

type Props = { userId: number };

export default function NewProfile(props: Props) {
  const router = useRouter();
  const { updateAuthStatus } = useAuthContext();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [errors, setErrors] = useState<Errors>([]);

  async function createProfile(event: Event) {
    event.preventDefault();
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.userId,
        firstName: firstName,
        lastName: lastName,
        location: location,
        timeStart: setTimeInDateObj(timeStart),
        timeEnd: setTimeInDateObj(timeEnd),
      }),
    });

    const profile = await response.json();
    if ('errors' in profile) {
      setErrors(profile.errors);
      return;
    }

    const destination =
      typeof router.query.returnTo === 'string' && router.query.returnTo
        ? router.query.returnTo
        : `/`;
    updateAuthStatus();
    router.push(destination);
  }

  return (
    <AppContainer>
      <ProfileForm>
        <Heading1>Profile settings</Heading1>
        <ProfileLabel>First name</ProfileLabel>
        <ProfileInput
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
        <ProfileLabel>Last name</ProfileLabel>
        <ProfileInput
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
        <ProfileLabel>Location</ProfileLabel>
        <ProfileInput
          value={location}
          onChange={(event) => setLocation(event.currentTarget.value)}
        />
        <ProfileLabel>I start at</ProfileLabel>
        <ProfileInput
          type="time"
          value={timeStart}
          onChange={(event) => setTimeStart(event.currentTarget.value)}
        />
        <ProfileLabel>I finish at</ProfileLabel>
        <ProfileInput
          type="time"
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
        <Button onClick={(event: Event) => createProfile(event)}>
          Get started
        </Button>
      </ProfileForm>
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../../util/database');
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {
      userId: session.userId,
    },
  };
}
