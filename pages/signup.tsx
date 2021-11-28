import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { Button } from '../components/Button';
import {
  Container,
  ErrorCard,
  ErrorMessage,
  Heading2,
  LogCard,
  LogForm,
  LogInput,
  LogLabel,
  LogLink,
  LogText,
} from '../styles/styles';
import { useAuthContext } from '../util/auth-context';
import { Errors } from '../util/types';
import { SignupResponse } from './api/signup';

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
      <LogCard>
        <Heading2 data-cy="page-backend-heading">Sign up</Heading2>
        <LogForm>
          <LogLabel htmlFor="username">Username</LogLabel>
          <LogInput
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <LogLabel htmlFor="password">Password</LogLabel>
          <LogInput
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <LogText>
            Don't have an account yet? Click here to{' '}
            <Link href="/signup" passHref>
              <LogLink>join</LogLink>
            </Link>
            .
          </LogText>
          {errors.length > 0 && (
            <ErrorCard>
              <AlertTriangle strokeWidth="1.5px" color="firebrick" />
              {errors.map((error) => (
                <ErrorMessage key={`error-${error.message}`}>
                  {error.message}
                </ErrorMessage>
              ))}
            </ErrorCard>
          )}
          <Button onClick={(event: Event) => signUp(event)}>Sign up</Button>
        </LogForm>
      </LogCard>
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
