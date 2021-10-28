import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Mindfull</title>
        <meta
          name="description"
          content="Mindfulness-based agile-inspired home office companion"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Shiny new Next.js app mainly for the backend this time!
    </div>
  );
};

export default Home;
