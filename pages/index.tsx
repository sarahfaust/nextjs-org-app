import Head from 'next/head';
import { Container, Heading1 } from '../styles/styles';

function Home() {
  return (
    <div>
      <Head>
        <title>Mindfull</title>
        <meta
          name="description"
          content="Mindfulness-based agile-inspired home office companion"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Heading1 data-cy="page-home-heading">Home office companion</Heading1>
      </Container>
    </div>
  );
}

export default Home;
