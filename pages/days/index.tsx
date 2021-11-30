import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { Play, Power } from 'react-feather';
import { ActionButton } from '../../components/ActionButton';
import { TabButton } from '../../components/TabButton';
import TimeSettings from '../../components/TimeSettings';
import Warmup from '../../components/Warmup';
import Winddown from '../../components/Winddown';
import {
  AppContainer,
  ButtonRowLeft,
  Heading1,
  TabContainer,
  TabContent,
  TabHeader,
} from '../../styles/styles';
import { ProfileType, TaskType } from '../../util/types';

type Props = {
  profile: ProfileType;
  tasks: TaskType[];
};

export default function Day(props: Props) {
  const [dayTasks, setDayTasks] = useState<TaskType[]>([]);
  const [activeTab, setActiveTab] = useState(1);

  function changeActiveTab(id: number) {
    setActiveTab(id);
  }

  // set current tasks to be used when saving to day_task table
  useEffect(() => {
    setDayTasks(props.tasks.filter((task) => task.isToday));
  }, [props.tasks]);

  function saveDay(event: Event) {
    event.preventDefault();
    console.log('start day');
    console.log(dayTasks);
  }

  function endDay(event: Event) {
    event.preventDefault();
    console.log('end day');
  }

  return (
    <AppContainer>
      <Heading1 data-cy="page-day-heading">Day</Heading1>
      <TabContainer>
        <TabHeader>
          <TabButton
            onClick={() => changeActiveTab(1)}
            isActive={activeTab === 1 ? true : false}
            dataCy="tab-button-day-1"
          >
            Warmup
          </TabButton>
          <TabButton
            onClick={() => changeActiveTab(2)}
            isActive={activeTab === 2 ? true : false}
            dataCy="tab-button-day-2"
          >
            Settings
          </TabButton>
          <TabButton
            onClick={() => changeActiveTab(3)}
            isActive={activeTab === 3 ? true : false}
            dataCy="tab-button-day-3"
          >
            Winddown
          </TabButton>
        </TabHeader>
        <TabContent>
          {activeTab === 1 && <Warmup />}
          {activeTab === 2 && (
            <TimeSettings profile={props.profile} dayId={0} />
          )}
          {activeTab === 3 && <Winddown />}
        </TabContent>
      </TabContainer>
      <ButtonRowLeft>
        <ActionButton onClick={(event: Event) => saveDay(event)}>
          <Play size={16} />
          Start day
        </ActionButton>
        <ActionButton onClick={(event: Event) => endDay(event)}>
          <Power size={16} />
          End day
        </ActionButton>
      </ButtonRowLeft>
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidatedUserBySessionToken, getProfileByUserId } = await import(
    '../../util/database'
  );

  const sessionToken = context.req.cookies.sessionToken;
  const validatedUser = await getValidatedUserBySessionToken(sessionToken);

  if (!validatedUser) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const profile = await getProfileByUserId(validatedUser.id);

  return {
    props: {
      profile: profile,
    },
  };
}
