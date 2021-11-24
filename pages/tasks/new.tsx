import { useRouter } from 'next/dist/client/router';
import TaskDetails from '../../components/TaskDetails';
import { Container } from '../../styles/styles';

type Props = { profileId: number; updateTasks: () => void };

export default function Tasks(props: Props) {
  const router = useRouter();

  function updateTask() {
    router.replace(router.asPath);
  }

  return (
    <Container>
      <TaskDetails
        profileId={props.profileId}
        task={null}
        subtasks={null}
        updateTasks={props.updateTasks}
        updateTask={updateTask}
      />
    </Container>
  );
}
