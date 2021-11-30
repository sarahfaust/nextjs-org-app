import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';
import ErrorCard from '../components/ErrorCard';
import {
  Container,
  Heading1,
  LogCard,
  LogForm,
  LogInput,
  LogLabel,
  LogLink,
  LogText,
} from '../styles/styles';
import { useAuthContext } from '../util/auth-context';
import { emailRegex, passwordRegex } from '../util/constants';
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

    if (!emailRegex.test(username)) {
      return setErrors([{ message: 'Please enter a valid email address.' }]);
    }
    if (!passwordRegex.test(password)) {
      return setErrors([
        {
          message:
            'The password must be at least 8 characters long and contain at least one of each: lowercase letter, uppercase letter, symbol, digit.',
        },
      ]);
    }
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
        <Heading1 data-cy="page-backend-heading">Sign up</Heading1>
        <LogForm>
          <LogLabel htmlFor="email address">Email address</LogLabel>
          <LogInput
            id="email address"
            name="email address"
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
            Already have an account? Click here to{' '}
            <Link href="/login" passHref>
              <LogLink>log in</LogLink>
            </Link>
            .
          </LogText>
          {errors.length > 0 && <ErrorCard errors={errors} margin="24px" />}
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
