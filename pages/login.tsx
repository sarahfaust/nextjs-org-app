import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Container, Heading2, LoginCard } from '../styles/styles';
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

type Props = { updateStatus: () => void };

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();

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
        : `/`;
    props.updateStatus();
    router.push(destination);
  }

  return (
    <Container>
      <LoginCard>
        <Heading2 data-cy="page-backend-heading">Log in</Heading2>
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
          )}{' '}
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
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
