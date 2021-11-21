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
