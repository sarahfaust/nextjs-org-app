import { GetServerSidePropsContext } from 'next';
import { useState } from 'react';
import ProfileSettings from '../../components/ProfileSettings';
import { TabButton } from '../../components/TabButton';
import TimeSettings from '../../components/TimeSettings';
import {
  AppContainer,
  Heading1,
  TabContainer,
  TabContent,
  TabHeader,
} from '../../styles/styles';
import { ProfileType } from '../../util/types';

type Props = { profile: ProfileType };

export default function Profile(props: Props) {
  const [activeTab, setActiveTab] = useState(1);

  function changeActiveTab(id: number) {
    setActiveTab(id);
  }

  return (
    <AppContainer>
      <Heading1>Settings</Heading1>
      <TabContainer>
        <TabHeader>
          <TabButton
            onClick={() => changeActiveTab(1)}
            isActive={activeTab === 1 ? true : false}
            dataCy="tab-button-day-1"
          >
            Times
          </TabButton>
          <TabButton
            onClick={() => changeActiveTab(2)}
            isActive={activeTab === 2 ? true : false}
            dataCy="tab-button-day-2"
          >
            Profile
          </TabButton>
          {/*           <TabButton
            onClick={() => changeActiveTab(3)}
            isActive={activeTab === 3 ? true : false}
            dataCy="tab-button-day-3"
          >
            Security
          </TabButton> */}
        </TabHeader>
        <TabContent>
          {activeTab === 1 && (
            <TimeSettings profile={props.profile} dayId={0} />
          )}
          {activeTab === 2 && <ProfileSettings profile={props.profile} />}
        </TabContent>
      </TabContainer>
    </AppContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { getValidatedUserBySessionToken, getProfileByProfileId } =
    await import('../../util/database');

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

  const profile = await getProfileByProfileId(Number(context.query.profileId));

  return {
    props: {
      profile: profile,
    },
  };
}
