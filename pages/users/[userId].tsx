import { Container, Heading2, LoginCard } from '../../styles/styles';

export default function User() {
  return (
    <Container>
      <LoginCard>
        <Heading2 data-cy="page-backend-heading">User</Heading2>
        <div>hello user</div>
      </LoginCard>
    </Container>
  );
}
