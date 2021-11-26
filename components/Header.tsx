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

const NavLink = styled.a`
  &:hover {
    color: darkgray;
  }
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

export default function Header() {
  return (
    <HeaderStyle>
      <Navigation>
        <Link href="/dashboard" passHref>
          <NavLink>
            <Logo>
              <LogoText>MINDFULL</LogoText>
            </Logo>
          </NavLink>
        </Link>
        <Link href="/signup" passHref>
          <NavLink data-cy="header-signup-link">Sign up</NavLink>
        </Link>
        <Link href="/login" passHref>
          <NavLink data-cy="header-login-link">Log in</NavLink>
        </Link>
      </Navigation>
    </HeaderStyle>
  );
}
