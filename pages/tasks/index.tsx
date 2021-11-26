import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import TaskDetails from '../../components/TaskDetails';
import { Container } from '../../styles/styles';
import { TaskType } from '../../util/types';

type Props = { profileId: number; tasks: TaskType[]; updateTasks: () => void };

export default function Tasks(props: Props) {
  const router = useRouter();
  function updateTask() {
    router.replace(router.asPath);
  }

  return (
    <Container>
      <ul>
        {props.tasks.map((task) => (
          <li key={task.id}>
            <TaskDetails
              profileId={props.profileId}
              task={task}
              subtasks={null}
              updateTasks={props.updateTasks}
              updateTask={updateTask}
            />
          </li>
        ))}
      </ul>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    getValidatedUserBySessionToken,
    getProfileBySessionToken,
    getTasksByProfileId,
  } = await import('../../util/database');

  const sessionToken = context.req.cookies.sessionToken;
  const validatedUser = await getValidatedUserBySessionToken(sessionToken);
  const profile = await getProfileBySessionToken(sessionToken);

  if (!validatedUser || !profile) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const tasks = await getTasksByProfileId(profile.id);

  return {
    props: { tasks: tasks, profileId: profile.id },
  };
}
