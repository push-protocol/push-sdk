import { Section, Span,Image } from "../../reusables";
import { IChatTheme } from "../theme";

type ProfileProps = {
    theme: IChatTheme;
    member: { wallet: string; image: string };
    customStyle?: CustomStyleParamsType | null;
  };
 type CustomStyleParamsType = {
    fontSize?: string;
    fontWeight?: string;
    imgHeight?: string;
    imgMaxHeight?: string;
    textColor?: string;
  };
  export const ProfileContainer = ({ theme, member, customStyle }: ProfileProps) => {
   
    return (
      <Section justifyContent="flex-start" >
        <Section
          height={customStyle?.imgHeight ?? '48px'}
          maxWidth="48px"
          borderRadius="100%"
          overflow="hidden"
          margin="0px 12px 0px 0px"
          position="relative"
   
        >
          <Image
            height={customStyle?.imgHeight ?? '48px'}
            maxHeight={customStyle?.imgMaxHeight ?? '48px'}
            width={'auto'}
            cursor="pointer"
            src={member?.image}
          />
        </Section>
        <Span
          fontSize={customStyle?.fontSize ?? '18px'}
          fontWeight={customStyle?.fontWeight ?? '400'}
          color={customStyle?.textColor ?? theme.textColor?.modalSubHeadingText}
          position="relative"
 
        >
          {member.wallet}
        </Span>
      </Section>
    );
  };