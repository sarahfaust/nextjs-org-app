import styled from '@emotion/styled';
import { MouseEvent, useEffect, useState } from 'react';
import { Edit2, Save, Trash, X } from 'react-feather';
import { ButtonRowLeft } from '../styles/styles';
import { getTimeStringFromDateObj } from '../util/date-time';
import { BreakType, Errors, ProfileType } from '../util/types';
import ErrorCard from './ErrorCard';

const TimeRow = styled.div`
  display: flex;
  flex-direction: column;
`;
export const TimeListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 36px;
  width: 100%;
  margin-bottom: 12px;
`;

export const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
`;

export const TimeLabel = styled.label`
  font-family: inherit;
  font-weight: 400;
`;

export const TimeInput = styled.input`
  padding: 8px;
  height: 36px;
  font-family: inherit;
  border: 1px solid #c5c5c5;
  border-radius: 2px;
  min-width: 96px;
  &:disabled {
    background-color: #f7f7f7;
    border: 1px solid #c5c5c5;
    border-radius: 2px;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  padding: 6px;
  &:hover {
    background-color: #ffffff;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

type Props = {
  break: BreakType | null;
  profile: ProfileType;
  dayId: number;
  isNewBreak: boolean;
  toggleNewBreak: () => void | null;
};

export default function TimeDetails(props: Props) {
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [errors, setErrors] = useState<Errors>([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (props.break) {
      setTimeStart(getTimeStringFromDateObj(props.break.timeStart));
      setTimeEnd(getTimeStringFromDateObj(props.break.timeEnd));
    }
    if (props.isNewBreak) {
      setIsEdit(true);
    }
  }, [props]);

  function toggleEdit() {
    setIsEdit((prev) => !prev);
  }

  // update existing break is only possible/necessary when the break is
  // already coming from the profile, otherwise a new break is saved in day_break
  async function updateBreak() {
    if (!timeStart || !timeEnd) {
      return setErrors([{ message: 'Please enter a time.' }]);
    }

    const response = await fetch('/api/breaks', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: props.profile.id,
        incentiveTypeId: 0,
        incentiveId: 0,
        timeStart: timeStart,
        timeEnd: timeEnd,
      }),
    });

    const createProfile = await response.json();
    if ('errors' in createProfile) {
      setErrors(createProfile.errors);
      return;
    }
  }

  // decide here what kind of time this is and call the according
  // update function<: saveProfile for work time, updateBreak for profile
  // breaks and createBreak for day breaks (save to breaks and day_breaks)
  function handleSave(event: MouseEvent) {
    event.preventDefault();
    updateBreak();
    console.log('handle save');
    console.log(props.dayId);
  }

  function handleDelete(event: MouseEvent) {
    event.preventDefault();
    console.log('handle delete');
  }

  function handleDiscard(event: MouseEvent) {
    event.preventDefault();
    console.log('new break', props.isNewBreak);
    if (props.isNewBreak) {
      props.toggleNewBreak();
      console.log('this is a new break');
    }
    toggleEdit();
    console.log('handle discard');
  }

  return (
    <TimeRow>
      <TimeListItem>
        <TimeContainer>
          <TimeLabel>Start</TimeLabel>
          <TimeInput
            type="time"
            disabled={isEdit ? false : true}
            value={timeStart}
            onChange={(event) => setTimeStart(event.currentTarget.value)}
          />
        </TimeContainer>
        <TimeContainer>
          <TimeLabel>End</TimeLabel>
          <TimeInput
            type="time"
            disabled={isEdit ? false : true}
            value={timeEnd}
            onChange={(event) => setTimeEnd(event.currentTarget.value)}
          />
        </TimeContainer>
        <Controls>
          {isEdit ? (
            <ButtonRowLeft>
              <IconButton
                aria-label="Discard changes"
                onClick={(event: MouseEvent) => {
                  handleDiscard(event);
                }}
              >
                <X
                  aria-hidden="true"
                  focusable="false"
                  strokeWidth="1px"
                  size={20}
                />
              </IconButton>
              {!props.isNewBreak && (
                <IconButton
                  aria-label="Delete time slot"
                  onClick={(event: MouseEvent) => {
                    handleDelete(event);
                  }}
                >
                  <Trash
                    aria-hidden="true"
                    focusable="false"
                    strokeWidth="1px"
                    size={20}
                  />
                </IconButton>
              )}
              <IconButton
                aria-label="Save changes"
                onClick={(event: MouseEvent) => {
                  handleSave(event);
                }}
              >
                <Save
                  aria-hidden="true"
                  focusable="false"
                  strokeWidth="1px"
                  size={20}
                />
              </IconButton>
            </ButtonRowLeft>
          ) : (
            <IconButton aria-label="Edit time slot" onClick={toggleEdit}>
              <Edit2
                aria-hidden="true"
                focusable="false"
                strokeWidth="1px"
                size={20}
              />
            </IconButton>
          )}
        </Controls>
      </TimeListItem>
      {errors.length > 0 && <ErrorCard errors={errors} margin="6px" />}
    </TimeRow>
  );
}
