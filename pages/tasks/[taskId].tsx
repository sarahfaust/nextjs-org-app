import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import TaskDetails from '../../components/TaskDetails';
import { getSubtasksByTaskId } from '../../util/database';
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
    <TaskDetails
      profileId={props.profileId}
      task={props.task}
      subtasks={props.subtasks}
      updateTasks={props.updateTasks}
      updateTask={updateTask}
    />
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken, getTaskByTaskId } = await import(
    '../../util/database'
  );
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const task = await getTaskByTaskId(Number(context.query.taskId));
  const subtasks = await getSubtasksByTaskId(Number(context.query.taskId));

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: { task: task, subtasks: subtasks },
  };
}
