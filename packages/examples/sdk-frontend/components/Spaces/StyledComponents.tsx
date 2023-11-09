import styled from 'styled-components';

export const Section = styled.section`
  border: 2px solid #ccc;
  padding: 25px;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme === 'dark' ? '#000' : '#fff'};

  & .headerText {
    color: ${(props) => props.theme === 'dark' ? '#fff' : '#000'};
    font-size: 2rem;
  }

  & .subHeaderText {
    color: ${(props) => props.theme === 'dark' ? '#fff' : '#000'};
    font-size: 1.2rem;
  }
`

export const SectionItem = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  & label.consoleLabel {
    color: green;
  }
`;

export const SectionItemCustom = styled(SectionItem)`
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0px;
`;

export const CodeFormatter = styled.pre`
  background: #eeebeb;
  padding: 15px;
  border-radius: 7px;
`;

export const SectionButton = styled.button`
  font-family: "Source Sans Pro",Arial,sans-serif;
  font-size: 16px;
  display: flex;
  margin-right: 15px;
  padding: 15px 20px;
  background: #674C9F;
  border: 0;
  border-radius: 7px;
  box-shadow: rgb(0 0 0 / 52%) 0px 0px 5px;
  color: #fff;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background: rgb(226, 8, 128);
  }
`;
