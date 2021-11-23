import styled from '@emotion/styled';
import { useRouter } from 'next/dist/client/router';
import { MouseEvent, useEffect, useState } from 'react';
import { Check, Circle, Trash } from 'react-feather';
import { SubtasksResponse } from '../pages/api/subtasks';
import { SubtaskResponse } from '../pages/api/subtasks/[subtaskId]';
import { ErrorCard, ErrorMessage, Form, HiddenButton } from '../styles/styles';
import { Errors, SubtaskType } from '../util/types';

const SubtaskRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const InputLine = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 6px;
  grid-gap: 2px;
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
  font-size: 16px;
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
`;

type Props = {
  subtask: SubtaskType | null;
  taskId: number;
  updateTasks: () => void;
};

export default function SubtaskDetail(props: Props) {
  const [subtaskName, setSubtaskName] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [errors, setErrors] = useState<Errors>([]);
  const [subtaskNameError, setSubtaskNameError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (props.subtask) {
      setSubtaskName(props.subtask.name);
      setIsDone(props.subtask.isDone);
    }
  }, [props.subtask]);

  async function saveSubtask(event: MouseEvent) {
    event.preventDefault();

    if (!subtaskName || subtaskName.trim().length === 0) {
      setSubtaskNameError('Please enter a subtask name.');
      return;
    }

    const response = await fetch(
      props.subtask === null
        ? '/api/subtasks'
        : `/api/subtasks/${props.subtask.id}`,
      {
        method: props.subtask === null ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: props.taskId,
          name: subtaskName,
          isDone: isDone,
        }),
      },
    );

    const subtask =
      props.subtask === null
        ? ((await response.json()) as SubtasksResponse)
        : ((await response.json()) as SubtaskResponse);
    if (subtask && 'errors' in subtask) {
      setErrors(subtask.errors);
      console.log(subtask.errors);
      return;
    }

    props.updateTasks();
  }

  async function deleteSubtask(event: MouseEvent) {
    event.preventDefault();

    if (props.subtask) {
      const response = await fetch(`/api/subtasks/${props.subtask.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const subtask = (await response.json()) as SubtaskResponse;
      if (subtask && 'errors' in subtask) {
        setErrors(subtask.errors);
        console.log(subtask.errors);
        return;
      }

      props.updateTasks();
      router.push('/tasks');
    }
  }

  return (
    <SubtaskRow>
      <InputLine>
        {isDone ? (
          <IconButton
            aria-label="Uncheck subtask"
            onClick={(event: MouseEvent) => {
              event.preventDefault();
              console.log('before set', isDone);
              setIsDone((prev) => !prev);
              console.log('after set', isDone);
            }}
          >
            <Check
              aria-hidden="true"
              focusable="false"
              strokeWidth="1px"
              size={20}
            />
          </IconButton>
        ) : (
          <IconButton
            aria-label="Check subtask"
            onClick={(event: MouseEvent) => {
              event.preventDefault();
              console.log('before set', isDone);
              setIsDone((prev) => !prev);
              console.log('after set', isDone);
            }}
          >
            <Circle
              aria-hidden="true"
              focusable="false"
              strokeWidth="1px"
              size={20}
            />
          </IconButton>
        )}
        <Form>
          <Input
            aria-label="Task name"
            aria-required="true"
            value={subtaskName}
            onChange={(event) => setSubtaskName(event.currentTarget.value)}
            required
          />
          <HiddenButton
            aria-label="Save task"
            type="submit"
            onClick={(event: MouseEvent) => {
              saveSubtask(event);
            }}
          />
        </Form>
        <Controls>
          {props.subtask && (
            <IconButton
              aria-label="Delete subtask"
              type="submit"
              onClick={(event: MouseEvent) => deleteSubtask(event)}
            >
              <Trash
                aria-hidden="true"
                focusable="false"
                strokeWidth="1px"
                size={20}
              />
            </IconButton>
          )}
        </Controls>
      </InputLine>
      {subtaskNameError && (
        <ErrorCard>
          <ErrorMessage>{subtaskNameError}</ErrorMessage>
        </ErrorCard>
      )}
      {errors.length > 0 && (
        <ErrorCard>
          {errors.map((error) => (
            <ErrorMessage key={`error-${error.message}`}>
              {error.message}
            </ErrorMessage>
          ))}
        </ErrorCard>
      )}
    </SubtaskRow>
  );
}
