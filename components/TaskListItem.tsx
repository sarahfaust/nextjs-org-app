import styled from '@emotion/styled';
import Link from 'next/link';
import { MouseEvent, useEffect, useState } from 'react';
import { Check, Circle } from 'react-feather';
import { TaskType } from '../util/types';

const Item = styled.li`
  display: flex;
  align-items: stretch;
  border-radius: 4px;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TaskListLink = styled.a`
  padding: 8px;
  width: 100%;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px;
`;

type Props = { task: TaskType; updateTasks: () => void };

export default function TaskListItem(props: Props) {
  const [isDone, setIsDone] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    setIsDone(props.task.isDone);
  }, [props.task]);

  useEffect(() => {
    console.log(`edited task ${props.task.name}`);
    setIsEdited(false);
  }, [isEdited]);

  return (
    <Item key={props.task.id}>
      {isDone ? (
        <IconButton
          aria-label="Uncheck task"
          aria-checked={props.task.isDone}
          onClick={(event: MouseEvent) => {
            event.preventDefault();
            setIsDone((prev) => !prev);
            setIsEdited(true);
          }}
        >
          <Check
            aria-hidden="true"
            focusable="false"
            strokeWidth="1px"
            color="limegreen"
          />
        </IconButton>
      ) : (
        <IconButton
          aria-label="Check task"
          aria-checked={props.task.isDone}
          onClick={(event: MouseEvent) => {
            event.preventDefault();
            setIsDone((prev) => !prev);
            setIsEdited(true);
          }}
        >
          <Circle
            aria-hidden="true"
            focusable="false"
            strokeWidth="1px"
            color="firebrick"
          />
        </IconButton>
      )}
      <Link href={`/tasks/${props.task.id}`} passHref>
        <TaskListLink data-cy={`sidebar-task-link-${props.task.id}`}>
          {props.task.name}
        </TaskListLink>
      </Link>
    </Item>
  );
}
