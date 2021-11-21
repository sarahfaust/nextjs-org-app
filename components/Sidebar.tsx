import styled from '@emotion/styled';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TaskType } from '../util/types';
import TaskList from './TaskList';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 280px;
  background-color: #e9e9e9;
  padding: 2rem;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const Heading = styled.h2`
  padding: 24px 0 12px;
  margin-bottom: 12px;
  font-size: 1.3rem;
  font-weight: 400;
  text-transform: uppercase;
  border-bottom: 1px solid grey;
`;

type Props = { tasks: TaskType[] };

export default function Sidebar(props: Props) {
  const [personalLog, setPersonalLog] = useState<TaskType[]>([]);
  const [dayLog, setDayLog] = useState<TaskType[]>([]);

  useEffect(() => {
    setPersonalLog(props.tasks.filter((task) => !task.isToday));
    setDayLog(props.tasks.filter((task) => task.isToday));
  }, [props.tasks]);

  return (
    <Container>
      <Heading>
        <Link href="/tasks">
          <a>Personal Log</a>
        </Link>
      </Heading>
      <TaskList tasks={personalLog} />
      <Heading>Day Log</Heading>
      <TaskList tasks={dayLog} />
    </Container>
  );
}
