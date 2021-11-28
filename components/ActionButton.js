import styled from '@emotion/styled';

const ButtonStyle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: lightblue;
  color: #292f36;
  margin: 0 12px 12px 0;
  padding: 6px 12px;
  border: 2px solid lightblue;
  border-radius: 12px;
  min-width: 40px;
  min-height: 40px;
  font: inherit;
  font-weight: 600;
  transition: 300ms;
  &:hover {
    background-color: transparent;
  }
  &:active {
    transform: scale(0.99);
  }
  &:disabled {
    background-color: lightgray;
  }
`;

export function ActionButton(props) {
  return (
    <ButtonStyle
      onClick={props.onClick}
      margin={props.margin}
      disabled={props.disabled}
      data-cy={props.dataCy}
    >
      {props.children}
    </ButtonStyle>
  );
}
