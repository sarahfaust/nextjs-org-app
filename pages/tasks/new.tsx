import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import TaskDetails from '../../components/TaskDetails';
import { AppContainer } from '../../styles/styles';

type Props = { profileId: number; updateTasks: () => void };

export default function Tasks(props: Props) {
  const router = useRouter();

  function updateTask() {
    router.replace(router.asPath);
  }

  return (
    <AppContainer>
      <TaskDetails
        profileId={props.profileId}
        task={null}
        subtasks={null}
        updateTasks={props.updateTasks}
        updateTask={updateTask}
      />
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidatedUserBySessionToken, getProfileBySessionToken } =
    await import('../../util/database');

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

  return {
    props: { profileId: profile.id },
  };
}
