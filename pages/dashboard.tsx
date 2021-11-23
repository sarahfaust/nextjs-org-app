import styled from '@emotion/styled';
// import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Container, Heading1 } from '../styles/styles';
import { TaskType } from '../util/types';

const Text = styled.div`
  margin: 24px 0;
`;

type Props = { firstName: string; tasks: TaskType[] };

export default function Dashboard(props: Props) {
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

  console.log('tasks', props.tasks);

  return (
    <Container>
      <Heading1 data-cy="page-home-heading">Dashboard</Heading1>
      <Text>
        Hi, {props.firstName}! You are logged in and ready to start. Add a new
        task to get started.
      </Text>
      <Text>
        You have {taskCount} tasks in your logs. Of those, {doneTasks} are done
        and {openTasks} are open.
      </Text>
      <Button onClick={(event: Event) => handleNewTask(event)}>
        Add new task
      </Button>
    </Container>
  );
}

/* export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../util/database');
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}
 */
