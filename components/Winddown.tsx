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

export default function Winddown() {
  const [review, setReview] = useState('');
  const [planning, setPlanning] = useState('');
  const [grateful, setGrateful] = useState('');
  const [keep, setKeep] = useState('');
  const [improve, setImprove] = useState('');
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
    <AreaColumn>
      <AreaContainer>
        <AreaColumn>
          <AreaCard>
            <AreaLabel>Review</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="How was your day? What were you working on? What worked well, or where did you struggle?"
              value={review}
              onChange={(event) => setReview(event.currentTarget.value)}
            />
          </AreaCard>
          <AreaCard>
            <AreaLabel>Planning</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="What are you planning for tomorrow? Any loose ends you want to tie? "
              value={planning}
              onChange={(event) => setPlanning(event.currentTarget.value)}
            />
          </AreaCard>
          <AreaCard>
            <AreaLabel>Grateful</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="What are you satisfied with today? What are you proud of or happy with? In any case, this is the place for a big THANK YOU to yourself."
              value={grateful}
              onChange={(event) => setGrateful(event.currentTarget.value)}
            />
          </AreaCard>
        </AreaColumn>
        <AreaColumn>
          <AreaCard>
            <AreaLabel>Keep</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="Which habits worked well enough to keep them? What did you enjoy more than usual?"
              value={keep}
              onChange={(event) => setKeep(event.currentTarget.value)}
            />
          </AreaCard>
          <AreaCard>
            <AreaLabel>Improve</AreaLabel>
            <Area
              disabled={isEdit ? false : true}
              placeholder="Which things would you like to do better the text time around? Where is room for improvement left?"
              value={improve}
              onChange={(event) => setImprove(event.currentTarget.value)}
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
    </AreaColumn>
  );
}
