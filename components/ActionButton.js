import styled from '@emotion/styled';

const ButtonStyle = styled.button`
  background-color: lightblue;
  color: #292f36;
  margin: ${(props) => props.margin};
  padding: 12px 24px;
  border: 2px solid lightblue;
  border-radius: 20px;
  min-width: 40px;
  min-height: 40px;
  font-weight: 600;
  font-family: inherit;
  transition: 300ms;
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background-color: lightgray;
  }
`;

export function Button(props) {
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
