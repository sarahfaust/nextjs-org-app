import styled from '@emotion/styled';
import { useRouter } from 'next/dist/client/router';
import { MouseEvent, useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Circle,
  Plus,
  Save,
  Trash,
} from 'react-feather';
import { TaskResponse } from '../pages/api/tasks/[taskId]';
import { ErrorCard, ErrorMessage, Form, HiddenButton } from '../styles/styles';
import { Errors, SubtaskType, TaskType } from '../util/types';
import SubtaskDetail from './SubtaskDetail';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 560px;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #f1f1f1;
  box-shadow: rgba(12, 12, 12, 0.25) 1px 1px 2px;
`;

const InputLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  grid-gap: 4px;
  border-radius: 4px;
  margin-bottom: 6px;
  width: 100%;
  &:hover {
    background-color: #fafafa;
  }
`;

const Input = styled.input`
  width: 100%;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  padding: 8px;
  font-family: inherit;
  font-size: 18px;
  &:focus {
    background-color: #fafafa;
    border: 1px solid white;
  }
  &:hover {
    background-color: #fafafa;
  }
`;

const IconButton = styled.button`
  background-color: transparent;
  color: none;
  border: none;
  border-radius: 8px;
  padding: 6px;
  &:hover {
    background-color: #fafafa;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 12px;
`;

type Props = {
  profileId: number;
  task: TaskType | null;
  subtasks: SubtaskType[] | null;
  updateTasks: () => void;
  updateTask: () => void;
};

export default function TaskDetails(props: Props) {
  const [taskName, setTaskName] = useState('');
  const [taskId, setTaskId] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const [errors, setErrors] = useState<Errors>([]);
  const [taskNameError, setTaskNameError] = useState('');
  const [newSubtask, setNewSubtask] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.task) {
      setTaskName(props.task.name);
      setTaskId(props.task.id);
      setIsDone(props.task.isDone);
      setIsToday(props.task.isToday);
      setNewSubtask(false);
    }
  }, [props.task]);

  async function saveTask(event: MouseEvent) {
    event.preventDefault();

    if (!taskName || taskName.trim().length === 0) {
      setTaskNameError('Please enter a task name.');
      return;
    }

    const response = await fetch(
      props.task === null ? '/api/tasks' : `/api/tasks/${props.task.id}`,
      {
        method: props.task === null ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: props.profileId,
          name: taskName,
          isDone: isDone,
          isToday: isToday,
        }),
      },
    );

    const task = (await response.json()) as TaskResponse;
    if (task && 'errors' in task) {
      setErrors(task.errors);
      console.log(task.errors);
      return;
    }

    props.updateTasks();
    props.updateTask();

    if (props.task === null && task) {
      router.push(`/tasks/${task.id}`);
    }
  }

  function addSubtask(event: MouseEvent) {
    event.preventDefault();
    setNewSubtask(true);
  }

  async function deleteTask(event: MouseEvent) {
    event.preventDefault();

    if (props.task) {
      const response = await fetch(`/api/tasks/${props.task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const task = (await response.json()) as TaskResponse;
      if (task && 'errors' in task) {
        setErrors(task.errors);
        console.log(task.errors);
        return;
      }

      props.updateTasks();
      router.push('/tasks');
    }
  }

  return (
    <Card>
      <Form>
        <InputLine>
          <Input
            value={taskName}
            onChange={(event) => setTaskName(event.currentTarget.value)}
            required
            aria-label="Task name"
            aria-required="true"
          />
          <HiddenButton
            aria-label="Save task"
            type="submit"
            onClick={(event: MouseEvent) => {
              saveTask(event);
            }}
          />
          {isDone ? (
            <IconButton
              aria-label="Uncheck task"
              aria-checked={isDone}
              onClick={(event: MouseEvent) => {
                event.preventDefault();
                setIsDone((prev) => !prev);
              }}
            >
              <CheckCircle
                aria-hidden="true"
                focusable="false"
                strokeWidth="1px"
              />
            </IconButton>
          ) : (
            <IconButton
              aria-label="Check task"
              aria-checked={isDone}
              onClick={(event: MouseEvent) => {
                event.preventDefault();
                setIsDone((prev) => !prev);
              }}
            >
              <Circle aria-hidden="true" focusable="false" strokeWidth="1px" />
            </IconButton>
          )}
        </InputLine>
        {taskNameError && (
          <ErrorCard>
            <ErrorMessage>{taskNameError}</ErrorMessage>
          </ErrorCard>
        )}
      </Form>
      {props.subtasks && props.subtasks.length > 0 && taskId !== 0 && (
        <>
          {props.subtasks.map((subtask) => (
            <li key={subtask.id}>
              <SubtaskDetail
                subtask={subtask}
                taskId={taskId}
                updateTasks={props.updateTask}
              />
            </li>
          ))}
        </>
      )}
      {newSubtask && props.task && (
        <SubtaskDetail
          subtask={null}
          taskId={props.task.id}
          updateTasks={props.updateTask}
        />
      )}
      <Controls>
        {props.task && (
          <IconButton
            aria-label="Add subtask"
            onClick={(event: MouseEvent) => addSubtask(event)}
          >
            <Plus aria-hidden="true" focusable="false" strokeWidth="1px" />
          </IconButton>
        )}
        {isToday ? (
          <IconButton
            aria-label="Uncheck today"
            onClick={(event) => {
              event.preventDefault();
              setIsToday(false);
            }}
          >
            <Calendar
              color="orange"
              aria-hidden="true"
              focusable="false"
              strokeWidth="1px"
            />
          </IconButton>
        ) : (
          <IconButton
            aria-label="Check today"
            onClick={(event) => {
              event.preventDefault();
              setIsToday(true);
            }}
          >
            <Calendar aria-hidden="true" focusable="false" strokeWidth="1px" />
          </IconButton>
        )}
        <IconButton
          aria-label="Delete task"
          onClick={(event: MouseEvent) => deleteTask(event)}
        >
          <Trash aria-hidden="true" focusable="false" strokeWidth="1px" />
        </IconButton>
        <IconButton
          aria-label="Save task"
          onClick={(event: MouseEvent) => {
            saveTask(event);
          }}
        >
          <Save aria-hidden="true" focusable="false" strokeWidth="1px" />
        </IconButton>
      </Controls>

      {errors.length > 0 && (
        <ErrorCard>
          {errors.map((error) => (
            <ErrorMessage key={`error-${error.message}`}>
              {error.message}
            </ErrorMessage>
          ))}
        </ErrorCard>
      )}
    </Card>
  );
}
