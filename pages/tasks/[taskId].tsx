import styled from '@emotion/styled';
import { GetServerSidePropsContext } from 'next';
// import { useRouter } from 'next/dist/client/router';
import { Button } from '../../components/Button';
import { Container } from '../../styles/styles';
import { TaskType } from '../../util/types';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 640px;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-family: inherit;
  font-weight: 400;
`;

const Input = styled.input`
  margin-bottom: 24px;
  padding: 8px;
  height: 36px;
  min-width: 240px;
  font-family: inherit;
`;

type Props = { task: TaskType };

export default function Task(props: Props) {
  // const router = useRouter();

  function handleSubmit() {}

  return (
    <Container>
      <Form>
        <Label>Task</Label>
        <Input value={props.task.name} />
        <Button onClick={handleSubmit}>Save</Button>
      </Form>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidSessionByToken, getTaskByTaskId } = await import(
    '../../util/database'
  );
  const sessionToken = context.req.cookies.sessionToken;
  const session = await getValidSessionByToken(sessionToken);
  const task = await getTaskByTaskId(Number(context.query.taskId));

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: { task: task },
  };
}
