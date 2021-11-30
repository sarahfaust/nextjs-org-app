import { useState } from 'react';
import { Edit2, Save, X } from 'react-feather';
import {
  ButtonRowLeft,
  ProfileForm,
  ProfileInput,
  ProfileLabel,
} from '../styles/styles';
import { Errors, ProfileType } from '../util/types';
import { ActionButton } from './ActionButton';
import ErrorCard from './ErrorCard';

type Props = { profile: ProfileType };

export default function ProfileSettings(props: Props) {
  const [firstName, setFirstName] = useState(props.profile.firstName);
  const [lastName, setLastName] = useState(props.profile.lastName);
  const [location, setLocation] = useState(props.profile.location);
  const [errors, setErrors] = useState<Errors>([]);
  const [isEdit, setIsEdit] = useState(false);

  function toggleEdit() {
    setIsEdit((prev) => !prev);
  }

  async function updateProfile(event: Event) {
    event.preventDefault();
    const response = await fetch(`/api/profiles/${props.profile.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.profile.userId,
        firstName: firstName,
        lastName: lastName,
        location: location,
        timeStart: props.profile.timeStart,
        timeEnd: props.profile.timeEnd,
      }),
    });

    const createProfile = await response.json();
    if ('errors' in createProfile) {
      setErrors(createProfile.errors);
      return;
    }

    toggleEdit();
  }

  function discardChanges(event: Event) {
    event.preventDefault();
    setFirstName(props.profile.firstName);
    setLastName(props.profile.lastName);
    setLocation(props.profile.location);
    toggleEdit();
  }

  return (
    <ProfileForm>
      <ProfileLabel>First name</ProfileLabel>
      <ProfileInput
        disabled={isEdit ? false : true}
        value={firstName}
        onChange={(event) => setFirstName(event.currentTarget.value)}
      />
      <ProfileLabel>Last name</ProfileLabel>
      <ProfileInput
        disabled={isEdit ? false : true}
        value={lastName}
        onChange={(event) => setLastName(event.currentTarget.value)}
      />
      <ProfileLabel>Location</ProfileLabel>
      <ProfileInput
        disabled={isEdit ? false : true}
        value={location}
        onChange={(event) => setLocation(event.currentTarget.value)}
      />
      {errors.length > 0 && <ErrorCard errors={errors} />}

      {isEdit ? (
        <ButtonRowLeft>
          <ActionButton onClick={(event: Event) => updateProfile(event)}>
            <Save size={16} />
            Save changes
          </ActionButton>
          <ActionButton onClick={(event: Event) => discardChanges(event)}>
            <X size={16} />
            Discard changes
          </ActionButton>
        </ButtonRowLeft>
      ) : (
        <ActionButton onClick={toggleEdit}>
          <Edit2 size={16} />
          Edit
        </ActionButton>
      )}
    </ProfileForm>
  );
}
