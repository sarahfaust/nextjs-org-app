import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { Play, Plus } from 'react-feather';
import { ActionButton } from '../components/ActionButton';
import { AppContainer, Heading1 } from '../styles/styles';
import { useAuthContext } from '../util/auth-context';
import { TaskType } from '../util/types';

const Text = styled.div`
  width: 432px;
  margin-bottom: 24px;
`;

const TaskStatContainer = styled.div`
  display: flex;
  gap: 36px;
  margin-bottom: 24px;
`;

const TaskStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
`;

const TaskNumber = styled.div`
  font-size: 96px;
  font-weight: 700;
  color: #6d6d6d;
`;

const TaskStatus = styled.p``;

type Props = { tasks: TaskType[] };

export default function Dashboard(props: Props) {
  const { firstName } = useAuthContext();
  const [taskCount, setTaskCount] = useState(0);
  const [doneTasks, setDoneTasks] = useState(0);
  const [openTasks, setOpenTasks] = useState(0);

  useEffect(() => {
    setTaskCount(props.tasks.length);
    setDoneTasks(props.tasks.filter((task) => task.isDone).length);
    setOpenTasks(props.tasks.filter((task) => !task.isDone).length);
  }, [props.tasks]);

  const router = useRouter();

  return (
    <AppContainer>
      <Heading1 data-cy="page-home-heading">Dashboard</Heading1>
      <Text>
        Hi, {firstName}! What a great day to be prodictive! These are your
        current stats and easy first actions to get started on your day.
      </Text>
      <TaskStatContainer>
        <TaskStats>
          <TaskNumber>{taskCount}</TaskNumber>
          <TaskStatus>overall tasks</TaskStatus>
        </TaskStats>
        <TaskStats>
          <TaskNumber>{openTasks}</TaskNumber>
          <TaskStatus>are open</TaskStatus>
        </TaskStats>
        <TaskStats>
          <TaskNumber>{doneTasks}</TaskNumber>
          <TaskStatus>are done</TaskStatus>
        </TaskStats>
      </TaskStatContainer>

      <ActionButton
        onClick={(event: Event) => {
          event.preventDefault();
          router.push('/tasks/new');
        }}
      >
        <Plus size={16} />
        Add new task
      </ActionButton>
      <ActionButton
        onClick={(event: Event) => {
          event.preventDefault();
          router.push('/days');
        }}
      >
        <Play size={16} />
        Start day
      </ActionButton>
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidatedUserBySessionToken } = await import('../util/database');

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
  return {
    // TODO: chech if a call makes sense here of if it would be better to just
    // use the tasks prop. If the call is done here, dashboard page needs to be dynamic
    /*   const tasks = await getTasksByProfileId(Number(context.query.profileId));
      props: { tasks: tasks },
   */
    props: {},
  };
}
