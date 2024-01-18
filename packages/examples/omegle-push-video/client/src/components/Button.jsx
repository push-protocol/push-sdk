import styled from "styled-components";

export default function ButtonStyled({onClick, text}) {
  return <Button onClick={onClick}>{text}</Button>;
}
export const Button = styled.button`
  background: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.2rem;
  margin: "10px";
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.7;
  }
`;
