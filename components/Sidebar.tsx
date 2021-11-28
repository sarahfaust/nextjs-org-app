import styled from '@emotion/styled';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, Home, LogOut, Plus, User } from 'react-feather';
import { useAuthContext } from '../util/auth-context';
import { TaskType } from '../util/types';
import TaskListItem from './TaskListItem';

const Container = styled.div`
  display: flex;
  flex: 0 0 480px;
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.2rem;
  background-color: #d3d3d3;
  border-right: 1px solid #b8b8b8;
`;

const TopNav = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 12px;
`;

const NavLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  background-color: #c5c5c5;
  color: #333333;
  border-radius: 24px;
  transition: 300ms;
  &:hover {
    border-radius: 20px;
    scale: 1.1;
    background-color: lightblue;
  }
`;

const TasksContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #e0e0e0;
  padding: 1.5rem;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const HeadingContainer = styled.h2`
  padding: 24px 0 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #b9b9b9;
`;

const Heading = styled.a`
  font-size: 1.3rem;
  font-weight: 400;
  letter-spacing: 2px;
  color: #3b3b3b;
  text-transform: uppercase;
`;

const TaskListContainer = styled.div`
  width: 100%;
`;

type Props = { tasks: TaskType[]; updateTasks: () => void };

export default function Sidebar(props: Props) {
  const { profileId } = useAuthContext();
  const [personalLog, setPersonalLog] = useState<TaskType[]>([]);
  const [dayLog, setDayLog] = useState<TaskType[]>([]);

  useEffect(() => {
    setPersonalLog(props.tasks.filter((task) => !task.isToday));
    setDayLog(props.tasks.filter((task) => task.isToday));
  }, [props.tasks]);

  return (
    <Container>
      <NavContainer>
        <TopNav>
          <Link href="/dashboard" passHref>
            <NavLink aria-label="Dashboard" data-cy="nav-profile-link">
              <Home
                aria-hidden="true"
                focusable="false"
                strokeWidth="1px"
                size={32}
              />
            </NavLink>
          </Link>
          <Link href={`/profiles/${profileId}`} passHref>
            <NavLink aria-label="Profile" data-cy="nav-profile-link">
              <User
                aria-hidden="true"
                focusable="false"
                strokeWidth="1px"
                size={32}
              />
            </NavLink>
          </Link>
          <Link href="/days" passHref>
            <NavLink aria-label="New day" data-cy="nav-newday-link">
              <Calendar
                aria-hidden="true"
                focusable="false"
                strokeWidth="1px"
                size={32}
              />
            </NavLink>
          </Link>
          <Link href="/tasks/new" passHref>
            <NavLink aria-label="New task" data-cy="nav-newtask-link">
              <Plus
                aria-hidden="true"
                focusable="false"
                strokeWidth="1px"
                size={32}
              />
            </NavLink>
          </Link>
        </TopNav>
        <NavLink
          href="/logout"
          aria-label="Logout"
          data-cy="header-logout-link"
        >
          <LogOut
            aria-hidden="true"
            focusable="false"
            strokeWidth="1px"
            size={32}
          />
        </NavLink>
      </NavContainer>
      <TasksContainer>
        <HeadingContainer>
          <Link href="/tasks" passHref>
            <Heading>Personal Log</Heading>
          </Link>
        </HeadingContainer>
        <TaskListContainer>
          <ul>
            {personalLog.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                updateTasks={props.updateTasks}
              />
            ))}
          </ul>
        </TaskListContainer>
        <HeadingContainer>
          <Link href="/tasks" passHref>
            <Heading>Day Log</Heading>
          </Link>
        </HeadingContainer>
        <TaskListContainer>
          <ul>
            {dayLog.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                updateTasks={props.updateTasks}
              />
            ))}
          </ul>
        </TaskListContainer>
      </TasksContainer>
    </Container>
  );
}
