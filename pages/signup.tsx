import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import {
  Container,
  ErrorCard,
  ErrorMessage,
  Heading2,
  LoginCard,
} from '../styles/styles';
import { useAuthContext } from '../util/auth-context';
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

type Props = { csrfToken: string };

export default function Signup(props: Props) {
  const router = useRouter();
  const { updateAuthStatus } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const inputFocus = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputFocus.current !== null) {
      inputFocus.current.focus();
    }
  }, [inputFocus]);

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

    updateAuthStatus();
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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          {errors.length > 0 && (
            <ErrorCard>
              {errors.map((error) => (
                <ErrorMessage key={`error-${error.message}`}>
                  {error.message}
                </ErrorMessage>
              ))}
            </ErrorCard>
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

  // Redirect from HTTP to HTTPS on Heroku
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
  }

  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
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
