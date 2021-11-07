import { Global } from '@emotion/react';
import { AppProps } from 'next/dist/shared/lib/router/router';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { componentStyle, globalStyles } from '../styles/styles';

function App({ Component, pageProps }: AppProps) {
  const [username, setUsername] = useState('');

  const refreshUsername = useCallback(async () => {
    const response = await fetch('/api/profile');
    const profile = await response.json();
    if ('errors' in profile) {
      console.log(profile.errors);
      return;
    }
    setUsername(profile.user.username);
  }, []);

  useEffect(() => {
    refreshUsername();
  }, [refreshUsername]);

  return (
    <>
      <Global styles={globalStyles} />
      <Layout username={username}>
        <Component
          {...pageProps}
          css={componentStyle}
          username={username}
          refreshUsername={setUsername}
        />
      </Layout>
    </>
  );
}

export default App;
