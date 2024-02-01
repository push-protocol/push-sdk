import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Section, Span } from '../../reusables';
import { Button, InfoContainer, ModalHeader } from '../reusables';
import { AddButtons } from './AddButtons';
import { ModalHeaderProps } from './CreateGroupModal';
import { ThemeContext } from '../theme/ThemeProvider';
import useMediaQuery from '../../../hooks/useMediaQuery';
import ConditionsComponent from './ConditionsComponent';
import { OperatorContainer } from './OperatorContainer';
import { handleDefineCondition } from '../helpers/tokenGatedGroup';
import { IChatTheme } from '../theme';

import { device } from '../../../config';
import { OPERATOR_OPTIONS_INFO } from '../constants';

export const DefineCondtion = ({
  onClose,
  handlePrevious,
  handleNext,
  criteriaStateManager,
}: ModalHeaderProps) => {
  const theme = useContext(ThemeContext);
  const isMobile = useMediaQuery(device.mobileL);

  const criteriaState = criteriaStateManager.getSelectedCriteria();

  const customButtonStyle = {
    background:
      criteriaState.selectedRules.length < 1
        ? theme.backgroundColor?.buttonDisableBackground
        : theme.backgroundColor?.buttonBackground,
    color:
      criteriaState.selectedRules.length < 1
        ? theme.textColor?.buttonDisableText
        : theme.textColor?.buttonText,
  };

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

  return (
    <Section
      flexDirection="column"
      gap="16px"
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
         <Section flexDirection="column" >
  
          {criteriaState.selectedRules.length > 1 && (
            <Section margin="5px 0 16px 0">
              <OperatorContainer
                operator={criteriaState.entryRuleTypeCondition}
                setOperator={(newEl: string) => {
                  criteriaState.setEntryRuleTypeCondition(
                    newEl as keyof typeof OPERATOR_OPTIONS_INFO
                  );
                }}
              />
            </Section>
          )}
         {criteriaState.selectedRules.length > 0 && <ConditionSection
            width="100%"
            overflow="hidden auto"
            maxHeight="15vh"
            theme={theme}
            padding="5px 4px 5px 0"
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
          </ConditionSection>}
   
   
        <AddButtons handleNext={handleNext} title={'+ Add criteria'} />
        </Section>
        {!criteriaState.selectedRules.length &&   <Span
          fontSize="15px"
          fontWeight="400"
          color={theme.textColor?.modalSubHeadingText}
        >
          You must add at least 1 criteria to enable gating
        </Span>}
     
      <Button
        onClick={verifyAndDoNext}
        customStyle={customButtonStyle}
        width="158px"
      >
        {criteriaState.isCondtionUpdateEnabled() ? 'Update' : 'Add'}
      </Button>

      <InfoContainer label='Learn more about access gating rules' cta='https://push.org/docs/chat/build/conditional-rules-for-group/' />
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