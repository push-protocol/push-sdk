import { useContext } from "react";
import { Section, Span } from "../../reusables";
import { SpamIcon } from "../../../icons/SpamIcon";
import { ThemeContext } from "../theme/ThemeProvider";
import React from "react";

export const InfoContainer = ({label,cta}:{label:string,cta:string}) => {
    const theme = useContext(ThemeContext);
    return (
      <Section gap="6px" zIndex="-1" cursor='pointer'>
        <SpamIcon />
       {label && <Span color={theme.textColor?.modalSubHeadingText} fontSize="15px" cursor='pointer'>
         {label}
        </Span>}
      </Section>
    );
  };
  
  