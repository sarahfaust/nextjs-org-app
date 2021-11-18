import { Global } from '@emotion/react';
// import { useRouter } from 'next/dist/client/router';
import { AppProps } from 'next/dist/shared/lib/router/router';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { componentStyle, globalStyles } from '../styles/styles';
import { Errors, TaskType } from '../util/types';

function App({ Component, pageProps }: AppProps) {
  const [username, setUsername] = useState('');
  // const [userId, setUserId] = useState(0);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [firstName, setFirstName] = useState('');
  const [profileId, setProfileId] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const router = useRouter();

  const updateStatus = useCallback(async () => {
    const response = await fetch('/api/status');
    const status = await response.json();
    if ('errors' in status) {
      console.log(status.errors);
      setUsername('');
      setIsAuthenticated(false);
      return;
    }
    console.log(status);
    setUsername(status.user.username);
    // setUserId(status.user.id);
    setFirstName(status.profile.firstName);
    setProfileId(status.profile.id);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  const updateTasks = useCallback(async () => {
    const response = await fetch('/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const allTasks = (await response.json()) as TaskType[] | { errors: Errors };
    if ('errors' in allTasks) {
      console.log(allTasks.errors);
      return;
    }
    setTasks(allTasks);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      updateTasks();
    }
  }, [updateTasks, isAuthenticated]);

  return (
    <>
      <Global styles={globalStyles} />
      <Layout
        isAuthenticated={isAuthenticated}
        username={username}
        profileId={profileId}
        tasks={tasks}
      >
        <Component
          {...pageProps}
          css={componentStyle}
          isAuthenticated={isAuthenticated}
          username={username}
          profileId={profileId}
          firstName={firstName}
          updateStatus={updateStatus}
          updateTasks={updateTasks}
        />
      </Layout>
    </>
  );
}

export default App;
