import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700&display=swap');

  html,
  body {
    margin: 0;
    font-family: 'Outfit', sans-serif;
    background-color: #f1f1f1;
    height: 100vh;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  li {
    list-style: none;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  label,
  a,
  p,
  input,
  h1,
  h2,
  span {
    color: #292f36;
    font-size: 16px;
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
  margin-bottom: 36px;
  text-transform: capitalize;
  font-size: 1.4rem;
  font-weight: 600;
  color: #292f36;
`;

export const Heading2 = styled.h2`
  padding-bottom: 36px;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const AppContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 2rem;
  height: 100%;
`;

export const Container = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 4rem;
  height: 100%;
`;

// LOGIN & SIGNUP
export const LogCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 48px;
  width: 480px;
  border-radius: 4px;
  border: 1px solid #6d6d6d;
  background-color: #f7f7f7;
`;

export const LogForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const LogLabel = styled.label`
  margin-bottom: 6px;
  font-family: inherit;
  font-weight: 400;
`;

export const LogInput = styled.input`
  margin-bottom: 24px;
  padding: 8px;
  height: 40px;
  width: 100%;
  font-family: inherit;
  border-radius: 4px;
  border: 1px solid darkgrey;
`;

export const LogText = styled.p`
  margin-bottom: 24px;
`;

export const LogLink = styled.a`
  text-decoration: underline;
  &:hover {
    color: lightblue;
  }
`;

// PROFILE
export const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const ProfileLabel = styled.label`
  margin-bottom: 6px;
  font-family: inherit;
  font-weight: 400;
`;

export const ProfileInput = styled.input`
  margin-bottom: 24px;
  padding: 8px;
  height: 36px;
  min-width: 240px;
  font-family: inherit;
  border: 1px solid #c5c5c5;
  border-radius: 2px;
  &:disabled {
    background-color: #f7f7f7;
    border: 1px solid #c5c5c5;
    border-radius: 2px;
  }
`;

// TASKS
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// ERROR MESSAGES
export const ErrorMessage = styled.p``;

export const ErrorCard = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 40px;
  padding-left: 12px;
  margin-bottom: 24px;
  border-radius: 4px;
  background-color: lightpink;
  border: 1px solid firebrick;
`;

// BUTTONS
export const HiddenButton = styled.button`
  display: none;
`;

export const ButtonRow = styled.div`
  display: flex;
`;
