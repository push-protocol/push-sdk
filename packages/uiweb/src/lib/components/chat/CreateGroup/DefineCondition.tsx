import { useContext, useEffect, useState } from 'react';

import { Section, Span } from '../../reusables';
import { Button, ModalHeader } from '../reusables';
import { AddButtons } from './AddButtons';
import { ModalHeaderProps } from './CreateGroupModal';
import { ThemeContext } from '../theme/ThemeProvider';
import { GatingRulesInformation } from './CreateGroupModal';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { device } from '../../../config';
import { OPERATOR_OPTIONS_INFO } from '../constants';
import ConditionsComponent from './ConditionsComponent';
import { OperatorContainer } from './OperatorContainer';
import { handleDefineCondition } from '../helpers/tokenGatedGroup';
import { IChatTheme } from '../theme';
import styled from 'styled-components';

export const DefineCondtion = ({
  onClose,
  handlePrevious,
  handleNext,
  criteriaStateManager,
}: ModalHeaderProps) => {
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

  const criteriaState = criteriaStateManager.getSelectedCriteria();

  const verifyAndDoNext = () => {
    handleDefineCondition(criteriaState, handlePrevious);
  };

  const getRules = () => {
    return [
      [{ operator: criteriaState.entryRuleTypeCondition }],
      ...criteriaState.selectedRules.map((el) => [el]),
    ];
  };

  // set state for edit condition
  useEffect(() => {
    if (criteriaState.isCondtionUpdateEnabled()) {
      criteriaState.setEntryRuleTypeCondition(
        criteriaState.entryOptionTypeArray[
          criteriaState.entryOptionsDataArrayUpdate
        ]
      );

      if (criteriaState.selectedRules.length === 0) {
        criteriaState.setSelectedRule([
          ...criteriaState.entryOptionsDataArray[
            criteriaState.entryOptionsDataArrayUpdate
          ],
        ]);
      }
    } else {
      //
    }
  }, []);
console.log(criteriaState)
  return (
    <Section
      flexDirection="column"
      gap="20px"
      width={isMobile ? '300px' : '400px'}
    >
      <ModalHeader
        title={
          criteriaState.isCondtionUpdateEnabled()
            ? 'Update Condition'
            : 'Define Condition'
        }
        handleClose={onClose}
        handlePrevious={handlePrevious}
      />
      {isCriteriaAdded && (
        <>
         {criteriaState.selectedRules.length>1 &&   <Section margin="20px 0 10px 0">
            <OperatorContainer
              operator={criteriaState.entryRuleTypeCondition}
              setOperator={(newEl: string) => {
                criteriaState.setEntryRuleTypeCondition(
                  newEl as keyof typeof OPERATOR_OPTIONS_INFO
                );
              }}
            />
          </Section>}
          <ConditionSection
            width="100%"
            overflow="hidden auto"
            maxHeight="20rem"
            theme={theme}
            padding="0 4px 0 0"
          >
            <ConditionsComponent
              conditionData={getRules()}
              deleteFunction={(idx) => {
                criteriaState.deleteRule(idx);
              }}
              updateFunction={(idx) => {
                criteriaState.setUpdateCriteriaIdx(idx);
                if (handleNext) {
                  handleNext();
                }
              }}
            />
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
      <Button
        onClick={verifyAndDoNext}
        customStyle={customButtonStyle}
        width="158px"
      >
        {criteriaState.isCondtionUpdateEnabled() ? 'Update' : 'Add'}
      </Button>
      <GatingRulesInformation />
    </Section>
  );
};

const ConditionSection = styled(Section)<{ theme: IChatTheme }>`
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
