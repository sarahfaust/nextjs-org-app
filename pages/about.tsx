import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 4rem;
  height: 100%;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 400px;
  height: 100%;
`;

const Heading = styled.h1`
  font-size: 48px;
  font-weight: 700;
  line-height: 52px;
  letter-spacing: -1px;
  margin-bottom: 48px;
`;

const Subheading = styled.h2`
  margin-bottom: 36px;
  font-size: 32px;
  font-weight: 600;
`;

const Text = styled.p`
  font-size: 24px;
  font-weight: 300;
`;

const Underline = styled.span`
  font: inherit;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: lightblue;
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Mindfull</title>
        <meta
          name="Mindfull"
          content="Mindfulness-based agile-inspired home office companion"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Heading>Sarah Faustmann</Heading>
        <InfoContainer>
          <InfoBox>
            <Subheading>Background</Subheading>
            <Text>
              English language <Underline>teaching</Underline>,
            </Text>
            <Text>
              educational <Underline>management</Underline>
            </Text>
            <Text>
              and print <Underline>media design</Underline>.
            </Text>
          </InfoBox>
          <InfoBox>
            <Subheading>Current</Subheading>
            <Text>
              Web Development <Underline>Bootcamp</Underline>,
            </Text>
            <Text>
              <Underline>BSc</Underline> in Computer Science
            </Text>
            <Text>(FH Campus Wien, Feb 2022)</Text>
          </InfoBox>
          <InfoBox>
            <Subheading>Focus</Subheading>
            <Text>
              <Underline>Full-stack web development</Underline>:
            </Text>
            <Text>React, Next.js, TypeScript, PostgreSQL, HTML, CSS</Text>
          </InfoBox>
        </InfoContainer>
      </Container>
    </>
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
