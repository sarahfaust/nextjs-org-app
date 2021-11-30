import styled from '@emotion/styled';
import { useState } from 'react';
import { Plus } from 'react-feather';
import { ButtonRowRight, Heading2 } from '../styles/styles';
import { setTimeInDateObj } from '../util/date-time';
import { ProfileType } from '../util/types';
import { ActionButton } from './ActionButton';
import TimeDetails from './TimeDetails';

type Props = { profile: ProfileType; dayId: number };

const TimeSettingsContainer = styled.div`
  display: flex;
  gap: 24px;
  width: 640px;
  margin-bottom: 24px;
`;

export default function TimeSettings(props: Props) {
  const [isNewBreak, setIsNewBreak] = useState(false);

  function toggleNewBreak() {
    setIsNewBreak((prev) => !prev);
    console.log('break toggled');
  }

  const breaks = [
    {
      id: 1,
      profileId: 1,
      incentiveTypeId: 0,
      incentiveId: 0,
      timeStart: setTimeInDateObj('10:45'),
      timeEnd: setTimeInDateObj('11:00'),
    },
    {
      id: 2,
      profileId: 1,
      incentiveTypeId: 0,
      incentiveId: 0,
      timeStart: setTimeInDateObj('12:30'),
      timeEnd: setTimeInDateObj('13:30'),
    },
    {
      id: 3,
      profileId: 1,
      incentiveTypeId: 0,
      incentiveId: 0,
      timeStart: setTimeInDateObj('15:15'),
      timeEnd: setTimeInDateObj('15:30'),
    },
  ];

  function addBreak(event: Event) {
    event.preventDefault();
    toggleNewBreak();
  }

  return (
    <>
      <TimeSettingsContainer>
        <Heading2>Work hours</Heading2>
        <TimeDetails
          break={null}
          profile={props.profile}
          dayId={props.dayId}
          isNewBreak={false}
          toggleNewBreak={toggleNewBreak}
        />
      </TimeSettingsContainer>
      <TimeSettingsContainer>
        <Heading2>Breaks</Heading2>
        <ul>
          {breaks.map((workBreak) => (
            <li key={workBreak.id}>
              <TimeDetails
                break={workBreak}
                profile={props.profile}
                dayId={props.dayId}
                isNewBreak={false}
                toggleNewBreak={toggleNewBreak}
              />
            </li>
          ))}
          {isNewBreak && (
            <TimeDetails
              break={null}
              profile={props.profile}
              dayId={props.dayId}
              isNewBreak={isNewBreak}
              toggleNewBreak={toggleNewBreak}
            />
          )}
        </ul>
      </TimeSettingsContainer>
      <ButtonRowRight>
        <ActionButton
          onClick={(event: Event) => {
            addBreak(event);
          }}
        >
          <Plus size={16} />
          Add new break
        </ActionButton>
      </ButtonRowRight>
    </>
  );
}
