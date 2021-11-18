import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
// import { useRouter } from 'next/dist/client/router';
import { Button } from '../../components/Button';
import { Container, Heading1 } from '../../styles/styles';
import { setTimeInDateObj } from '../../util/date-time';
import { Errors } from '../../util/types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 640px;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-family: inherit;
  font-weight: 400;
`;

const Input = styled.input`
  margin-bottom: 24px;
  padding: 8px;
  height: 36px;
  min-width: 240px;
  font-family: inherit;
`;

type Props = { userId: number; updateStatus: () => void };

export default function NewProfile(props: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  console.log('user id from props', props.userId);
  console.log('time end object', setTimeInDateObj(timeEnd));

  async function createProfile(event: Event) {
    event.preventDefault();
    console.log('creating profile in profile');
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
    props.updateStatus();
    router.push(destination);
  }

  return (
    <Container>
      <Form>
        <Heading1>Profile settings</Heading1>
        <Label>First name</Label>
        <Input
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
        <Label>Last name</Label>
        <Input
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
        <Label>Location</Label>
        <Input
          value={location}
          onChange={(event) => setLocation(event.currentTarget.value)}
        />
        <Label>I start at</Label>
        <Input
          type="time"
          value={timeStart}
          onChange={(event) => setTimeStart(event.currentTarget.value)}
        />
        <Label>I finish at</Label>
        <Input
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
      </Form>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../../util/database');
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  console.log('user id in gssp', session?.userId);

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
