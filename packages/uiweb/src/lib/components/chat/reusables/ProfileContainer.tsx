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
  };
  export const ProfileContainer = ({ theme, member, customStyle }: ProfileProps) => {
    console.log(member);
    return (
      <Section justifyContent="flex-start" position="relative" zIndex="2">
        <Section
          height={customStyle?.imgHeight ?? '48px'}
          maxWidth="48px"
          borderRadius="100%"
          overflow="hidden"
          margin="0px 12px 0px 0px"
          position="relative"
          zIndex="2"
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
          color={theme.textColor?.modalSubHeadingText}
          position="relative"
          zIndex="2"
        >
          {member.wallet}
        </Span>
      </Section>
    );
  };