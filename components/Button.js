import styled from '@emotion/styled';

const Btn = styled.button`
  background-color: lightblue;
  color: #292f36;
  margin: ${(props) => props.margin};
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  min-width: 40px;
  min-height: 40px;
  font-weight: 600;
  font-family: inherit;
  &:hover {
    background-color: lightsteelblue;
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
    <Btn
      onClick={props.onClick}
      margin={props.margin}
      disabled={props.disabled}
      data-cy={props.dataCy}
    >
      {props.children}
    </Btn>
  );
}
