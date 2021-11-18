import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Container, Heading2, LoginCard } from '../../styles/styles';
import { Errors, TaskType } from '../../util/types';
import { TaskResponse } from '../api/tasks/[taskId]';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 640px;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-family: inherit;
  font-weight: 400;
`;

const Input = styled.input`
  margin-bottom: 24px;
  padding: 8px;
  height: 36px;
  min-width: 240px;
  font-family: inherit;
`;

const Checkbox = styled.input`
  margin-bottom: 24px;
  padding: 8px;
  height: 24px;
  width: 24px;
`;

type Props = { profileId: number; updateTasks: () => void };

export default function NewTask(props: Props) {
  const [taskName, setTaskName] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const [errors, setErrors] = useState<Errors>([]);
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskType[]>([]);

  async function createTask(event: Event) {
    event.preventDefault();
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: props.profileId,
        name: taskName,
        isDone: isDone,
        isToday: isToday,
      }),
    });

    // TODO: make sure task is not null
    const newTask = (await response.json()) as TaskResponse;
    if (newTask && 'errors' in newTask) {
      setErrors(newTask.errors);
      console.log(newTask.errors);
      return;
    }

    props.updateTasks();
    router.push('/');
  }

  async function getAllTasks(event: Event) {
    event.preventDefault();
    const response = await fetch('/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // TODO: make sure name is not null
    const allTasks = (await response.json()) as TaskType[] | { errors: Errors };
    if ('errors' in allTasks) {
      setErrors(allTasks.errors);
      console.log(allTasks.errors);
      return;
    }

    setTasks(allTasks);
  }

  return (
    <Container>
      <LoginCard>
        <Heading2 data-cy="page-newtask-heading">Add new task</Heading2>
        <Form>
          <Label htmlFor="taskName">Task name</Label>
          <Input
            id="taskName"
            name="taskName"
            value={taskName}
            onChange={(event) => setTaskName(event.currentTarget.value)}
          />
          <Label htmlFor="isDone">Task is done</Label>
          <Checkbox
            type="checkbox"
            id="isDone"
            name="isDone"
            checked={isDone}
            onChange={(event) => setIsDone(event.currentTarget.checked)}
          />
          <Label htmlFor="isToday">Task is today</Label>
          <Checkbox
            type="checkbox"
            id="isToday"
            name="isToday"
            checked={isToday}
            onChange={(event) => setIsToday(event.currentTarget.checked)}
          />
          {errors.length > 0 && (
            <div>
              {errors.map((error) => (
                <div key={`error-${error.message}`}>{error.message}</div>
              ))}
            </div>
          )}

          <Button onClick={(event: Event) => createTask(event)}>
            Add task
          </Button>
          <Button onClick={(event: Event) => getAllTasks(event)}>
            All tasks
          </Button>

          {tasks.length > 0 && (
            <div>
              {tasks.map((task) => (
                <div key={`error-${task.id}`}>{task.name}</div>
              ))}
            </div>
          )}
        </Form>
      </LoginCard>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken } = await import('../../util/database');
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

  return {
    props: {
      session: session.userId,
    },
  };
}
