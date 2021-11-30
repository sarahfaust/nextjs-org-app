import styled from '@emotion/styled';
import { AlertTriangle } from 'react-feather';

const ErrorField = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  margin-bottom: ${(props) => props.margin};
  border-radius: 4px;
  background-color: lightpink;
  border: 1px solid firebrick;
`;

const ErrorLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorMessage = styled.p`
  flex-grow: 1;
`;

export default function ErrorCard(props) {
  return (
    <ErrorField margin={props.margin}>
      <ErrorLogo>
        <AlertTriangle strokeWidth="1.5px" color="firebrick" size={20} />
      </ErrorLogo>
      {props.errors.map((error) => (
        <ErrorMessage key={`error-${error.message}`}>
          {error.message}
        </ErrorMessage>
      ))}
    </ErrorField>
  );
}
