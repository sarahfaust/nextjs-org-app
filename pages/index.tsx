import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { Button } from '../components/Button';
import { Container, Heading1 } from '../styles/styles';

type Props = { firstName: string; isAuthenticated: boolean };

export default function Home(props: Props) {
  const router = useRouter();

  function handleNewTask(event: Event) {
    event.preventDefault();
    router.push('/tasks');
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
        <Heading1 data-cy="page-home-heading">Dashboard</Heading1>
        {props.isAuthenticated ? (
          <>
            <div>
              Hi, {props.firstName}! You are logged in and ready to start. Add a
              new task to get started.
            </div>
            <Button onClick={(event: Event) => handleNewTask(event)}>
              Add new task
            </Button>
          </>
        ) : (
          <div>You are currently not logged in.</div>
        )}
      </Container>
    </div>
  );
}
