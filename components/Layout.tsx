import styled from '@emotion/styled';
import { TaskType } from '../util/types';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
`;

type Props = {
  isAuthenticated: boolean;
  tasks: TaskType[];
  username: string;
  profileId: number;
  children: JSX.Element;
};

export default function Layout(props: Props) {
  return (
    <LayoutContainer>
      {props.isAuthenticated && <Sidebar tasks={props.tasks} />}
      <Content>
        <Header
          isAuthenticated={props.isAuthenticated}
          username={props.username}
          profileId={props.profileId}
        />
        <Main>{props.children}</Main>
        <Footer />
      </Content>
    </LayoutContainer>
  );
}
