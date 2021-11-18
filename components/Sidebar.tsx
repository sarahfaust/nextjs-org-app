import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { TaskType } from '../util/types';
import TaskList from './TaskList';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 280px;
  background-color: lightblue;
`;

type Props = { tasks: TaskType[] };

export default function Sidebar(props: Props) {
  const [personalLog, setPersonalLog] = useState<TaskType[]>([]);
  const [dayLog, setDayLog] = useState<TaskType[]>([]);
  // const [isOpen, setIsOpen] = useState(true);
  // const [errors, setErrors] = useState<Errors>([]);

  useEffect(() => {
    setPersonalLog(props.tasks.filter((task) => !task.isToday));
    setDayLog(props.tasks.filter((task) => task.isToday));
  }, [props.tasks]);

  return (
    <SidebarContainer>
      <TaskList tasks={personalLog} heading="Personal Log" />
      <TaskList tasks={dayLog} heading="Day Log" />
    </SidebarContainer>
  );
}
