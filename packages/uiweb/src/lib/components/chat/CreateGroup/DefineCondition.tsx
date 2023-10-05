import { useContext, useState } from 'react';

import { Section, Span } from '../../reusables';
import { Button, ModalHeader } from '../reusables';
import { AddButtons } from './AddButtons';
import { ModalHeaderProps } from './CreateGroupModal';
import { ThemeContext } from '../theme/ThemeProvider';
import { GatingRulesInformation } from './CreateGroupModal';
import useMediaQuery from '../../../hooks/useMediaQuery';
import OptionButtons from '../reusables/OptionButtons';

import { device } from '../../../config';
import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_INFO } from '../constants';
import { ConditionArray, IChatTheme } from '../exportedTypes';
import ConditionsComponent from './ConditionsComponent';
import { OperatorContainer } from './OperatorContainer';
import styled from 'styled-components';

const dummyConditonsData: ConditionArray[] = [
  [{ operator: 'any' }],
  [
    {
      type: 'PUSH',
      category: 'ERC20',
      subcategory: 'holder',
      data: {
        contract: 'eip155:1:0xf418588522d5dd018b425E472991E52EBBeEEEEE',
        amount: 1,
        decimals: 18,
      },
    },
  ],
  [
    { operator: 'all' },
    {
      type: 'PUSH',
      category: 'ERC20',
      subcategory: 'holder',
      data: {
        contract: 'eip155:137:0x58001cC1A9E17A20935079aB40B1B8f4Fc19EFd1',
        amount: 1,
        decimals: 18,
      },
    },
    {
      type: 'PUSH',
      category: 'ERC721',
      subcategory: 'holder',
      data: {
        contract: 'eip155:137:0x58001cC1A9E17A20935079aB40B1B8f4Fc19EFd1',
        amount: 1,
        decimals: 18,
      },
    },
    {
      type: 'GUILD',
      category: 'ROLES',
      subcategory: 'DEFAULT',
      data: {
        id: '1',
        role: '346243',
        comparison: 'all',
      },
    },
  ],
  [
    { operator: 'any' },
    {
      type: 'PUSH',
      category: 'INVITE',
      subcategory: 'DEFAULT',
      data: {
        inviterRoles: 'ADMIN',
      },
    },
    {
      type: 'PUSH',
      category: 'INVITE',
      subcategory: 'DEFAULT',
      data: {
        inviterRoles: 'OWNER',
      },
    },
  ],
];

const dummySingleCondtionData: ConditionArray[] = dummyConditonsData[2].map(
  (criteria) => [criteria]
);

export const DefineCondtion = ({
  onClose,
  handlePrevious,
  handleNext,
}: ModalHeaderProps) => {
  const [criteriaOperator, setCriteriaOperator] = useState<string>(
    dummySingleCondtionData[0][0].operator as string
  );

  const theme = useContext(ThemeContext);
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const customButtonStyle = {
    background: disableButton
      ? theme.backgroundColor?.buttonDisableBackground
      : theme.backgroundColor?.buttonBackground,
    color: disableButton
      ? theme.textColor?.buttonDisableText
      : theme.textColor?.buttonText,
  };
  const [isCriteriaAdded, setIsCriteriaAdded] = useState<boolean>(true);
  const isMobile = useMediaQuery(device.mobileL);

  return (
    <Section
      flexDirection="column"
      gap="20px"
      width={isMobile ? '300px' : '400px'}
    >
      <ModalHeader
        title="Define Condition"
        handleClose={onClose}
        handlePrevious={handlePrevious}
      />
      {isCriteriaAdded && (
        <>
          <Section margin="20px 0 10px 0">
            <OperatorContainer
              operator={criteriaOperator}
              setOperator={setCriteriaOperator}
            />
          </Section>
          <ConditionSection width="100%"  overflow="hidden auto" maxHeight="20rem" theme={theme} padding='0 4px 0 0'>

            <ConditionsComponent conditionData={dummySingleCondtionData} />
          </ConditionSection>
        </>
      )}
      <Section flexDirection="column" gap="10px">
        <AddButtons handleNext={handleNext} title={'+ Add criteria'} />
        <Span
          fontSize="15px"
          fontWeight="400"
          color={theme.textColor?.modalSubHeadingText}
        >
          You must add at least 1 criteria to enable gating
        </Span>
      </Section>
      <Button customStyle={customButtonStyle} width="158px">
        Add
      </Button>
      <GatingRulesInformation />
    </Section>
  );
};


const ConditionSection = styled(Section)<{theme:IChatTheme}>`
&::-webkit-scrollbar-thumb {
 background: ${(props) => props.theme.scrollbarColor};
 border-radius: 10px;
}

&::-webkit-scrollbar-button {
  height: 40px;
}

&::-webkit-scrollbar {
 width: 4px;
}
`;