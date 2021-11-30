import { useState } from 'react';
import { Edit2, Save, X } from 'react-feather';
import {
  Area,
  AreaCard,
  AreaColumn,
  AreaContainer,
  AreaLabel,
  ButtonRowRight,
} from '../styles/styles';
import { ActionButton } from './ActionButton';

// type Props = { task: TaskType; updateTasks: () => void };

export default function Warmup() {
  const [review, setReview] = useState('');
  const [planning, setPlanning] = useState('');
  const [blockers, setBlockers] = useState('');
  // const [isRealistic, setIsRealistic] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  function toggleEdit() {
    setIsEdit((prev) => !prev);
  }

  function updateWinddown(event: Event) {
    event.preventDefault();
    console.log('update');
    toggleEdit();
  }

  function discardChanges(event: Event) {
    event.preventDefault();
    console.log('discard');
    toggleEdit();
  }

  return (
    <>
      <AreaContainer>
        <AreaColumn>
          <AreaCard>
            <AreaLabel>Review</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="What were you working on yesterday? What worked well, or where did you struggle, and how is that helpful for today?"
              value={review}
              onChange={(event) => setReview(event.currentTarget.value)}
            />
          </AreaCard>
          <AreaCard>
            <AreaLabel>Planning</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="What are you planning for today? How can you structure your day?"
              value={planning}
              onChange={(event) => setPlanning(event.currentTarget.value)}
            />
          </AreaCard>
        </AreaColumn>
        <AreaColumn>
          <AreaCard>
            <AreaLabel>Blockers</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="Where are possible roadblocks? What is keeping you from achieving your goals? How can you help yourself or where can you get help?"
              value={blockers}
              onChange={(event) => setBlockers(event.currentTarget.value)}
            />
          </AreaCard>
        </AreaColumn>
      </AreaContainer>
      <ButtonRowRight>
        {isEdit ? (
          <>
            <ActionButton onClick={(event: Event) => updateWinddown(event)}>
              <Save size={16} />
              Save changes
            </ActionButton>
            <ActionButton onClick={(event: Event) => discardChanges(event)}>
              <X size={16} />
              Discard changes
            </ActionButton>
          </>
        ) : (
          <ActionButton onClick={toggleEdit}>
            <Edit2 size={16} />
            Edit
          </ActionButton>
        )}
      </ButtonRowRight>
    </>
  );
}
