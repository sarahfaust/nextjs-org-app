import { GetServerSidePropsContext } from 'next';

export default function Logout() {
  return 'Logged out';
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { serialize } = await import('cookie');
  const sessionToken = context.req.cookies.sessionToken;
  const isProduction = process.env.NODE_ENV === 'production';

  if (sessionToken) {
    await fetch(`${process.env.BASE_URL}/api/logout`);
    context.res.setHeader(
      'Set-Cookie',
      serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
        httpOnly: isProduction,
        secure: true,
      }),
    );
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
