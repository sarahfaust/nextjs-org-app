import styled from '@emotion/styled';
import Link from 'next/link';
import { BorderButton } from './BorderButton';
import { Button } from './Button';

const HeaderStyle = styled.header`
  display: flex;
  justify-content: space-between;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: transparent;
  margin: 2rem 4rem;
`;

const NavLink = styled.a`
  &:hover {
    color: #6d6d6d;
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
  font-size: 2.5rem;
  font-weight: 600;
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
      </Navigation>
      <Navigation>
        <Link href="/about" passHref>
          <NavLink data-cy="header-about-link">About</NavLink>
        </Link>
        <Link href="/login" passHref>
          <BorderButton data-cy="header-login-link">Log in</BorderButton>
        </Link>
        <Link href="/signup" passHref>
          <Button data-cy="header-signup-link">Join</Button>
        </Link>
      </Navigation>
    </HeaderStyle>
  );
}
