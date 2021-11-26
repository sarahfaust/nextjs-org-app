import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { Button } from '../components/Button';
import { Container } from '../styles/styles';

const Text = styled.div`
  margin: 24px 0;
`;

export default function Home() {
  const router = useRouter();

  function handleLogin(event: Event) {
    event.preventDefault();
    router.push('/login');
  }

  function handleSignup(event: Event) {
    event.preventDefault();
    router.push('/signup');
  }

  return (
    <div>
      <Head>
        <title>Mindfull</title>
        <meta
          name="Mindfull"
          content="Mindfulness-based agile-inspired home office companion"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Text>You are currently not logged in.</Text>
        <Button onClick={(event: Event) => handleLogin(event)}>Log in</Button>
        <Text>If you don't have an account yet, you can register here:</Text>
        <Button onClick={(event: Event) => handleSignup(event)}>Sign up</Button>
      </Container>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidatedUserBySessionToken } = await import('../util/database');

  const sessionToken = context.req.cookies.sessionToken;
  const validatedUser = await getValidatedUserBySessionToken(sessionToken);

  if (validatedUser) {
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
