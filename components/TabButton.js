import styled from '@emotion/styled';

const ButtonStyle = styled.button`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${(props) => (props.isActive ? '#ffffff' : '#f7f7f7')};
  border-radius: 4px;
  padding: 12px 24px;
  border-radius: 4px 0 0 0;
  font: inherit;
  font-weight: ${(props) => (props.isActive ? '500' : '400')};
  font-size: 18px;
  transition: 300ms;
  &:hover {
    background-color: #ffffff;
  }
`;

export function TabButton(props) {
  return (
    <ButtonStyle
      onClick={props.onClick}
      isActive={props.isActive}
      dataCy={props.dataCy}
    >
      {props.children}
    </ButtonStyle>
  );
}
