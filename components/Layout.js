import styled from '@emotion/styled';
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

export default function Layout(props) {
  console.log('layout auth', props.isAuthenticated);
  return (
    <LayoutContainer>
      {props.isAuthenticated && <Sidebar tasks={props.tasks} />}
      <Content>
        <Header
          isAuthenticated={props.isAuthenticated}
          username={props.username}
          profileId={props.profileId}
        />
        <main>{props.children}</main>
        <Footer />
      </Content>
    </LayoutContainer>
  );
}
