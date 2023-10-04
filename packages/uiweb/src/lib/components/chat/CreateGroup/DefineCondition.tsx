import { useContext, useEffect, useState } from 'react';

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
import ConditionsComponent from './ConditionsComponent';

export const DefineCondtion = ({
  onClose,
  handlePrevious,
  handleNext,
  entryCriteria
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

  const verifyAndDoNext = ()=>{
    if(entryCriteria.isCondtionUpdateEnabled()){
      // handle update
      entryCriteria.updateCondition()
    }else{
      // handle insertion
      entryCriteria.addNewCondtion()
    }

    if(handlePrevious){
      handlePrevious()
    }
  }

  const getRules = ()=>{
    return[
      [{ operator: entryCriteria.entryRuleTypeCondition}],
      ...entryCriteria.selectedRules.map(el => [el]) 
    ]
  }

  useEffect(()=>{
    if(entryCriteria.isCondtionUpdateEnabled()){
      entryCriteria.setEntryRuleTypeCondition(
        entryCriteria.entryOptionTypeArray[entryCriteria.entryOptionsDataArrayUpdate]
      )

      entryCriteria.setSelectedRule([
        ...entryCriteria.entryOptionsDataArray[entryCriteria.entryOptionsDataArrayUpdate]
      ])
    }
  },[0])


  return (
    <Section
      flexDirection="column"
      gap="20px"
      width={isMobile ? '300px' : '400px'}
    >
      <ModalHeader
        title={entryCriteria.isCondtionUpdateEnabled() ? "Update Condition" : "Define Condition"}
        handleClose={onClose}
        handlePrevious={handlePrevious}
      />
      {isCriteriaAdded && (
        <Section flexDirection="column" gap="16px">
          <OptionButtons
            options={OPERATOR_OPTIONS}
            selectedValue={
              entryCriteria.entryRuleTypeCondition
            }
            handleClick={(newEl: string) => {
              entryCriteria.setEntryRuleTypeCondition(newEl as keyof typeof OPERATOR_OPTIONS_INFO);
            }}
          />
          <Span fontSize="14px">
            {
              OPERATOR_OPTIONS_INFO[
                entryCriteria.entryRuleTypeCondition as keyof typeof OPERATOR_OPTIONS_INFO
              ].head
            } 
            <Span color={theme.textColor?.modalSubHeadingText}>
              {' '}
              {
                OPERATOR_OPTIONS_INFO[
                  entryCriteria.entryRuleTypeCondition as keyof typeof OPERATOR_OPTIONS_INFO
                ].tail
              }
            </Span>
          </Span>{' '}
          <ConditionsComponent
            conditionData={getRules()}
            deleteFunction={(idx)=>{
              entryCriteria.deleteRule(idx)
            }}
            updateFunction={(idx)=>{
              entryCriteria.setUpdateCriteriaIdx(idx)
              if(handleNext){
                handleNext()
              }
            }}
          />
        </Section>
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
      <Button onClick={verifyAndDoNext} customStyle={customButtonStyle} width="158px">
        {entryCriteria.isCondtionUpdateEnabled() ? "Update" : "Add"}
      </Button>
      <GatingRulesInformation />
    </Section>
  );
};
