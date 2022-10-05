import styled from "styled-components";

export type ButtonProps = {
  disabled?: boolean,
  bgColor?: string,
  color?: string
};

const ActionButton = styled.button<ButtonProps>`
  all: unset;
  background: ${(props) => props.bgColor || 'rgb(226, 8, 128)'};
  color: ${(props) => props.color || '#fff'};
  padding: 10px 20px;
  font-weight: 500;
  border-radius: 3px;
  cursor: ${(props) => props.disabled ? 'default' : 'pointer'};
  opacity: ${(props) => props.disabled ? '0.5' : '1'};
  transition: 300ms;
  margin-left: auto;
  &:hover {
    opacity: ${(props) => props.disabled ? '0.5' : '0.9'};
  }

  @media (max-width: 600px) {
    padding: 8px 20px;
  }
`;

export default ActionButton;