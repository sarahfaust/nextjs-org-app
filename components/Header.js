import styled from '@emotion/styled';
import Link from 'next/link';

const HeaderStyle = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
  background-color: #ffffff;
  margin: 2rem;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  line-height: 0.9;
  background-color: lightblue;
`;

const LogoText = styled.p`
  font-size: 2rem;
  font-weight: 100;
  color: #292f36;
`;

export default function Header(props) {
  return (
    <HeaderStyle>
      <Navigation>
        <Link href="/">
          <a>
            <Logo>
              <LogoText>MINDFULL</LogoText>
            </Logo>
          </a>
        </Link>
        <Link href="/signup">
          <a data-cy="header-signup-link">Sign up</a>
        </Link>
        <Link href="/login">
          <a data-cy="header-login-link">Log in</a>
        </Link>
        <Link href="/profile">
          <a data-cy="header-profile-link">Profile</a>
        </Link>
        <Link href="/logout">
          <a data-cy="header-logout-link">Logout</a>
        </Link>
      </Navigation>
      <Navigation>
        <Link href="/profile">
          <a data-cy="header-username-link">Username: {props.username}</a>
        </Link>
      </Navigation>
    </HeaderStyle>
  );
}
