import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
// import { useRouter } from 'next/dist/client/router';
import { Button } from '../../components/Button';
import ErrorCard from '../../components/ErrorCard';
import {
  Container,
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
        timeStart: setTimeInDateObj('08:00'),
        timeEnd: setTimeInDateObj('17:00'),
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
    <Container>
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
        {errors.length > 0 && <ErrorCard errors={errors} />}
        <Button onClick={(event: Event) => createProfile(event)}>
          Get started
        </Button>
      </ProfileForm>
    </Container>
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
