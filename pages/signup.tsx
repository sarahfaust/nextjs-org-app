import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Container, Heading2, LoginCard } from '../styles/styles';
import { Errors } from '../util/types';
import { SignupResponse } from './api/signup';

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

type Props = { updateStatus: () => void; csrfToken: string };

export default function Signup(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

  async function signUp(event: Event) {
    event.preventDefault();
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        csrfToken: props.csrfToken,
      }),
    });

    const signup = (await response.json()) as SignupResponse;
    if ('errors' in signup) {
      setErrors(signup.errors);
      return;
    }

    props.updateStatus();
    router.push('/profiles');
  }

  return (
    <Container>
      <LoginCard>
        <Heading2 data-cy="page-backend-heading">Sign up</Heading2>
        <Form>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          {errors.length > 0 && (
            <div>
              {errors.map((error) => (
                <div key={`error-${error.message}`}>{error.message}</div>
              ))}
            </div>
          )}
          <Button onClick={(event: Event) => signUp(event)}>Sign up</Button>
        </Form>
      </LoginCard>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');
  const { createToken } = await import('../util/csrf');

  /*   // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/signup`,
        permanent: true,
      },
    };
  } */

  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (session) {
    // Redirect the user when they have a session token by returning an object with the `redirect` prop
    // https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: createToken(),
    },
  };
}
