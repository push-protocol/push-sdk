import { Section, Span } from '../../reusables';
import { Button, ModalHeader } from '../reusables';
import { AddButtons } from './AddButtons';
import { ModalHeaderProps } from './CreateGroupModal';
import { useContext, useState } from 'react';
import { ThemeContext } from '../theme/ThemeProvider';
import { GatingRulesInformation } from './CreateGroupModal';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { device } from '../../../config';
import OptionButtons from '../reusables/OptionButtons';
import Criteria from './Criteria';
import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_INFO } from '../constants';
import { SingleAndMultipleCriteria } from './SingleAndMultipleCriteria';
import { Rule } from './Type';
import { rulesToCriteriaOptions } from './CreateGroupType';

export const DefineCondtion = ({
  onClose,
  handlePrevious,
  handleNext,
  entryCriteria
}: ModalHeaderProps) => {
  
  //todo remove dummy data after we have condition data
  
  const criteriaOptions = [
    {
      id: 0,
      type: 'Token',
      value: '1.0 ETH',
      title: 'Token',
      function: () => console.log('Token'),
    },
    // {
    //     id: 1,
    //     type: 'Token',
    //     value: '1.0 ETH',
    //     title: 'Token',
    //     function: () => console.log("NFT")
    // }
  ];

  // const ruleToCriteriaOptions = (rule:Rule, idx:number) =>{
  //   return [{
  //     id:idx,
  //     type: rule.type,
  //     value: rule.data.amount,
  //     title: rule.category,
  //     function: () => console.log('Token'),
  //   }]
  // }

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
    entryCriteria.addNewCondtion()

    if(handlePrevious){
      handlePrevious()
    }
  }

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
        <Section flexDirection="column" gap="16px">
          <OptionButtons
            options={OPERATOR_OPTIONS}
            selectedValue={entryCriteria.entryRuleTypeCondition}
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
              <Section>
                <SingleAndMultipleCriteria dropdownValues={rulesToCriteriaOptions(entryCriteria.selectedRules)} conditionType={entryCriteria.entryRuleTypeCondition}/>
              </Section>
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
        Add
      </Button>
      <GatingRulesInformation />
    </Section>
  );
};
