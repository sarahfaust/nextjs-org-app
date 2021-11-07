import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@100;200;300;400;500;600;700&display=swap');

  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

  html,
  body {
    margin: 0;
    font-family: Barlow, sans-serif;
    background-color: #ffffff;
  }

  a {
    color: #333333;
    text-decoration: none;
    cursor: pointer;
    &:hover {
      color: darkgray;
    }
  }

  li {
    list-style: none;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export const componentStyle = css`
  min-height: 100vh;
  padding: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
`;

export const Heading1 = styled.h1`
  margin: 24px;
  padding: 4px;
  text-transform: capitalize;
  font-size: 1.7rem;
  font-weight: 200;
  color: #292f36;
`;

export const Heading2 = styled.h2`
  padding-bottom: 36px;
  font-size: 1.5rem;
  font-weight: 100;
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0 3rem;
`;

export const RowCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 48px;
  margin: 36px;
  max-width: 960px;
  background-color: whitesmoke;
`;

export const ColCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 48px;
  margin: 36px;
  max-width: 960px;
  background-color: whitesmoke;
`;

export const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 48px;
  margin: 36px;
  max-width: 480px;
  background-color: whitesmoke;
`;

export const TextStyle = styled.p`
  margin-bottom: 12px;
  line-height: 1.5;
  max-width: 320px;
`;