import { Global } from '@emotion/react';
// import { useRouter } from 'next/dist/client/router';
import { AppProps } from 'next/dist/shared/lib/router/router';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { componentStyle, globalStyles } from '../styles/styles';
import { authContext } from '../util/auth-context';
import { Errors, TaskType } from '../util/types';

function App({ Component, pageProps }: AppProps) {
  const [userId, setUserId] = useState(0);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [firstName, setFirstName] = useState('');
  const [profileId, setProfileId] = useState(0);
  const [hasAuth, setHasAuth] = useState(false);

  const updateAuthStatus = useCallback(async () => {
    const response = await fetch('/api/status');
    const status = await response.json();

    if ('errors' in status) {
      console.log('status has error', status.errors);
      setUserId(0);
      setHasAuth(false);
      return;
    }

    setUserId(status.user.id);
    setFirstName(status.profile.firstName);
    setProfileId(status.profile.id);
    setHasAuth(true);
  }, []);

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
    updateAuthStatus();
  }, [updateAuthStatus]);

  useEffect(() => {
    if (hasAuth) {
      updateTasks();
    }
  }, [updateTasks, hasAuth]);

  return (
    <>
      <Global styles={globalStyles} />
      <authContext.Provider
        value={{ hasAuth, updateAuthStatus, userId, profileId, firstName }}
      >
        <Layout tasks={tasks}>
          <Component
            {...pageProps}
            css={componentStyle}
            tasks={tasks}
            updateTasks={updateTasks}
          />
        </Layout>
      </authContext.Provider>
    </>
  );
}

export default App;
