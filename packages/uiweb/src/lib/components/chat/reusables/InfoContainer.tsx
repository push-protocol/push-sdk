import { useContext } from "react";
import { Section, Span } from "../../reusables";
import { SpamIcon } from "../../../icons/SpamIcon";
import { ThemeContext } from "../theme/ThemeProvider";
import React from "react";
import styled from "styled-components";


interface InfoContainerProps {
  label: string;
  cta: string;
  link?: string;
}


export const InfoContainer = ({ label, cta, link }: InfoContainerProps) => {
  const theme = useContext(ThemeContext);
  return (
    <Section zIndex="-1" cursor='pointer'>
      <Link href={link} target={link ? '_target' : ''}>
        <SpamIcon />
        {label && <Span color={theme.textColor?.modalSubHeadingText} fontSize="15px" cursor='pointer'>
          {label}
        </Span>}
      </Link>
    </Section>
  );
};


const Link = styled.a`
text-decoration: none;
display: flex;
align-items: center;
justify-content: center;
gap: 6px;
`

