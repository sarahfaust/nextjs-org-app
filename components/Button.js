import styled from '@emotion/styled';

const SquareButton = styled.button`
  background-color: none;
  color: #292f36;
  border: none;
  margin: ${(props) => props.margin};
  padding: 12px 24px;
  border: 1px solid #292f36;
  border-radius: 2px;
  min-width: 40px;
  min-height: 40px;
  font-weight: 600;
  font-family: inherit;
  &:hover {
    background-color: lightblue;
  }
  &:active {
    transform: scale(0.98);
    box-shadow: 2px 2px 4px 2px rgba(100, 100, 100, 0.2);
  }
  &:disabled {
    background-color: lightgray;
  }
`;

export function Button(props) {
  return (
    <SquareButton
      onClick={props.onClick}
      margin={props.margin}
      disabled={props.disabled}
      data-cy={props.dataCy}
    >
      {props.children}
    </SquareButton>
  );
}
