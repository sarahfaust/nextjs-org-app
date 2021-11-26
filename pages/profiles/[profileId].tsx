import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
// import { useRouter } from 'next/dist/client/router';
import { Button } from '../../components/Button';
import { Container, Heading1 } from '../../styles/styles';
import {
  getTimeStringFromDateObj,
  setTimeInDateObj,
} from '../../util/date-time';
import { Errors, ProfileType } from '../../util/types';

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
  &:disabled {
    background-color: #f9f9f9;
    border: 1px solid darkgrey;
    border-radius: 2px;
  }
`;

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

  function toggleEdit(event: Event) {
    event.preventDefault();
    setIsEdit((prev) => !prev);
  }

  async function updateProfile(event: Event) {
    event.preventDefault();
    console.log('sending update');
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

    toggleEdit(event);
  }

  return (
    <Container>
      <Form>
        <Heading1>Profile settings</Heading1>
        <Label>First name</Label>
        <Input
          disabled={isEdit ? false : true}
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
        <Label>Last name</Label>
        <Input
          disabled={isEdit ? false : true}
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
        <Label>Location</Label>
        <Input
          disabled={isEdit ? false : true}
          value={location}
          onChange={(event) => setLocation(event.currentTarget.value)}
        />
        <Label>I start at</Label>
        <Input
          type="time"
          disabled={isEdit ? false : true}
          value={timeStart}
          onChange={(event) => setTimeStart(event.currentTarget.value)}
        />
        <Label>I finish at</Label>
        <Input
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
          <>
            <Button onClick={(event: Event) => updateProfile(event)}>
              Save changes
            </Button>
            <Button onClick={(event: Event) => toggleEdit(event)}>
              Discard changes
            </Button>
          </>
        ) : (
          <Button onClick={(event: Event) => toggleEdit(event)}>
            Edit profile
          </Button>
        )}
      </Form>
    </Container>
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
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}
