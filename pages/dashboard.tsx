import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { AppContainer, Heading1 } from '../styles/styles';
import { useAuthContext } from '../util/auth-context';
import { TaskType } from '../util/types';

const Text = styled.div`
  margin: 24px 0;
`;

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

  function handleNewTask(event: Event) {
    event.preventDefault();
    router.push('/tasks/new');
  }

  return (
    <AppContainer>
      <Heading1 data-cy="page-home-heading">Dashboard</Heading1>
      <Text>
        Hi, {firstName}! You are logged in and ready to start. Add a new task to
        get started.
      </Text>
      <Text>
        You have {taskCount} tasks in your logs. Of those, {doneTasks} are done
        and {openTasks} are open.
      </Text>
      <Button onClick={(event: Event) => handleNewTask(event)}>
        Add new task
      </Button>
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
