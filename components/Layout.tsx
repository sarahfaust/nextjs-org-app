import styled from '@emotion/styled';
import { useAuthContext } from '../util/auth-context';
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
  height: 100%;
`;

const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
`;

type Props = {
  tasks: TaskType[];
  children: JSX.Element;
  updateTasks: () => void;
};

export default function Layout(props: Props) {
  const { hasAuth } = useAuthContext();

  return (
    <LayoutContainer>
      {hasAuth && (
        <>
          <Sidebar tasks={props.tasks} updateTasks={props.updateTasks} />
          <Content>
            <Main>{props.children}</Main>
          </Content>
        </>
      )}
      {!hasAuth && (
        <Content>
          <Header />
          <Main>{props.children}</Main>
          <Footer />
        </Content>
      )}
    </LayoutContainer>
  );
}
