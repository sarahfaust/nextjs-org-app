import styled from '@emotion/styled';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../util/auth-context';
import { TaskType } from '../util/types';
import TaskList from './TaskList';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 280px;
  background-color: #e9e9e9;
  padding: 2rem;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const Heading = styled.h2`
  padding: 24px 0 12px;
  margin-bottom: 12px;
  font-size: 1.3rem;
  font-weight: 400;
  text-transform: uppercase;
  border-bottom: 1px solid grey;
`;

const Navigation = styled.nav``;
const NavLink = styled.a``;

type Props = { tasks: TaskType[] };

export default function Sidebar(props: Props) {
  const { hasAuth, profileId, firstName } = useAuthContext();
  const [personalLog, setPersonalLog] = useState<TaskType[]>([]);
  const [dayLog, setDayLog] = useState<TaskType[]>([]);

  useEffect(() => {
    setPersonalLog(props.tasks.filter((task) => !task.isToday));
    setDayLog(props.tasks.filter((task) => task.isToday));
  }, [props.tasks]);

  return (
    <Container>
      <Navigation>
        {hasAuth && (
          <>
            <Link href={`/profiles/${profileId}`} passHref>
              <NavLink data-cy="header-profile-link">Profile</NavLink>
            </Link>
            <Link href={`/profiles/${profileId}`} passHref>
              <NavLink data-cy="header-username-link">
                Username: {firstName}
              </NavLink>
            </Link>
            <NavLink href="/logout" data-cy="header-logout-link">
              Logout
            </NavLink>
          </>
        )}
      </Navigation>
      <Heading>
        <Link href="/tasks">
          <a>Personal Log</a>
        </Link>
      </Heading>
      <TaskList tasks={personalLog} />
      <Heading>Day Log</Heading>
      <TaskList tasks={dayLog} />
    </Container>
  );
}
