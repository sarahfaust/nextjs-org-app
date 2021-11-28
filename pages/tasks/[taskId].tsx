import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import TaskDetails from '../../components/TaskDetails';
import { AppContainer } from '../../styles/styles';
import { SubtaskType, TaskType } from '../../util/types';

type Props = {
  profileId: number;
  task: TaskType;
  subtasks: SubtaskType[] | null;
  updateTasks: () => void;
};

export default function Task(props: Props) {
  const router = useRouter();

  function updateTask() {
    router.replace(router.asPath);
  }

  return (
    <AppContainer>
      <TaskDetails
        profileId={props.profileId}
        task={props.task}
        subtasks={props.subtasks}
        updateTasks={props.updateTasks}
        updateTask={updateTask}
      />
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {
    getValidatedUserBySessionToken,
    getProfileBySessionToken,
    getTaskByTaskIdAndProfileId,
    getSubtasksByTaskIdAndProfileId,
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
  const task = await getTaskByTaskIdAndProfileId(
    Number(context.query.taskId),
    profile.id,
  );
  const subtasks = await getSubtasksByTaskIdAndProfileId(
    Number(context.query.taskId),
    profile.id,
  );

  return {
    props: { task: task, subtasks: subtasks, profileId: profile.id },
  };
}
