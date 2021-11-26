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
import { LoginResponse } from './api/login';

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

export default function Login() {
  const router = useRouter();
  const { hasAuth, updateAuthStatus } = useAuthContext();

  if (hasAuth) {
    router.push('/dashboard');
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const inputFocus = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (inputFocus.current !== null) {
      inputFocus.current.focus();
    }
  }, [inputFocus]);

  async function logIn(event: Event) {
    event.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const login = (await response.json()) as LoginResponse;
    if ('errors' in login) {
      setErrors(login.errors);
      console.log(login.errors);
      return;
    }

    const destination =
      typeof router.query.returnTo === 'string' && router.query.returnTo
        ? router.query.returnTo
        : `/dashboard`;
    updateAuthStatus();
    router.push(destination);
  }

  return (
    <Container>
      <LoginCard>
        <Heading2 data-cy="page-backend-heading">Log in</Heading2>
        <Form>
          <Label htmlFor="username">Username</Label>
          <Input
            ref={inputFocus}
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
          <Button onClick={(event: Event) => logIn(event)}>Log in</Button>
        </Form>
      </LoginCard>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');

  // redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
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
    props: {},
  };
}
