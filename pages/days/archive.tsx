import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { AppContainer, Heading1 } from '../../styles/styles';

const Item = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 4px;
  padding-bottom: 24px;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Date = styled.div`
  font-size: 18px;
  font-weight: 900;
  width: 240px;
`;

const Tasks = styled.div`
  font-size: 18px;
  font-weight: 400;
  width: 240px;
`;

export default function Archive() {
  const days = [
    { id: 1, date: 'Monday, 2021-09-13', tasksDone: 5 },
    { id: 2, date: 'Friday, 2021-10-22', tasksDone: 12 },
    { id: 3, date: 'Tuesday, 2021-11-02', tasksDone: 9 },
    { id: 4, date: 'Monday, 2021-11-15', tasksDone: 10 },
  ];
  return (
    <AppContainer>
      <Heading1 data-cy="page-archive-heading">Archive</Heading1>
      <ul>
        {days.map((day) => (
          <Item key={day.id}>
            <Date>{day.date}</Date>
            <Tasks>{day.tasksDone} tasks completed</Tasks>
          </Item>
        ))}
      </ul>
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidatedUserBySessionToken, getProfileByUserId } = await import(
    '../../util/database'
  );

  const sessionToken = context.req.cookies.sessionToken;
  const validatedUser = await getValidatedUserBySessionToken(sessionToken);

  if (!validatedUser) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const profile = await getProfileByUserId(validatedUser.id);

  return {
    props: {
      profile: profile,
    },
  };
}
