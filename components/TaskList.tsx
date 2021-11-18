import styled from '@emotion/styled';
import Link from 'next/link';
import { Heading2 } from '../styles/styles';
import { TaskType } from '../util/types';

const TaskListContainer = styled.div`
  width: 200px;
  color: black;
`;

type Props = { tasks: TaskType[]; heading: string };

export default function TaskList(props: Props) {
  return (
    <TaskListContainer>
      <Heading2>{props.heading}</Heading2>
      <ul>
        {props.tasks.map((task) => (
          <li key={task.id}>
            <Link href={`/tasks/${task.id}`}>
              <a data-cy={`sidebar-task-link-${task.id}`}>{task.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </TaskListContainer>
  );
}
