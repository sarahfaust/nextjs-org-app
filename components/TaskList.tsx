import styled from '@emotion/styled';
import Link from 'next/link';
import { Check, Circle } from 'react-feather';
import { TaskType } from '../util/types';

const TaskListContainer = styled.div`
  width: 200px;
`;

const TaskListItem = styled.li`
  display: flex;
  align-items: center;
  border-radius: 4px;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TaskListLink = styled.a`
  padding: 8px;
  width: 100%;
  color: #333333;
`;

type Props = { tasks: TaskType[] };

export default function TaskList(props: Props) {
  return (
    <TaskListContainer>
      <ul>
        {props.tasks.map((task) => (
          <TaskListItem key={task.id}>
            {task.isDone ? (
              <Check strokeWidth="1px" />
            ) : (
              <Circle strokeWidth="1px" />
            )}
            <Link href={`/tasks/${task.id}`} passHref>
              <TaskListLink data-cy={`sidebar-task-link-${task.id}`}>
                {task.name}
              </TaskListLink>
            </Link>
          </TaskListItem>
        ))}
      </ul>
    </TaskListContainer>
  );
}
