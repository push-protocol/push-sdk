import { useContext, useState } from 'react';
import { MdError } from 'react-icons/md';
import { ModalHeader } from '../reusables/Modal';
import OptionButtons, { OptionDescription } from '../reusables/OptionButtons';
import { Section, Span } from '../../reusables';
import { ToggleInput } from '../reusables';
import { Button } from '../reusables';
import { GatingRulesInformation, ModalHeaderProps } from './CreateGroupModal';
import { GroupTypeState } from './CreateGroupModal';

import { ThemeContext } from '../theme/ThemeProvider';
import useToast from '../reusables/NewToast';
import {ConditionType, CriteriaStateType, Rule, } from './Type'
import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_INFO } from '../constants';
import ConditionsComponent from './ConditionsComponent';

const GROUP_TYPE_OPTIONS: Array<OptionDescription> = [
  {
    heading: 'Open',
    subHeading: 'Anyone can join',
    value: 'open',
  },
  {
    heading: 'Encrypted',
    subHeading: 'Users must join group to view',
    value: 'encrypted',
  },
];

const ACCESS_TYPE_TITLE = {
  ENTRY: {
    heading: 'Conditions to Join',
    subHeading: 'Add a condition to join or leave it open for everyone',
  },
  CHAT: {
    heading: 'Conditions to Chat',
    subHeading: 'Add a condition to join or leave it open for everyone',
  },
};

interface AddConditionProps {
  heading: string;
  subHeading: string;
  handleNext?: () => void;
  criteriaState: CriteriaStateType;
}

const AddConditionSection = ({
  heading,
  subHeading,
  handleNext,
  criteriaState,
}: AddConditionProps) => {
  const theme = useContext(ThemeContext);
    //todo - dummy data to be removed after we get condition data

  const generateMapping =()=>{
    return criteriaState.entryOptionsDataArray.map((rule,idx)=>(
      [
        {operator: criteriaState.entryOptionTypeArray[idx]},
        ...rule.map(el => el)
      ]
    ))
  }

  return (
    <Section alignItems="start" flexDirection="column" gap="10px">
      <Section flexDirection="column" alignItems="start" gap="5px">
        <Span
          color={theme.textColor?.modalHeadingText}
          fontSize="16px"
          fontWeight="500"
        >
          {heading}
        </Span>
        <Span
          color={theme.textColor?.modalSubHeadingText}
          fontWeight="400"
          fontSize="12px"
        >
          {subHeading}
        </Span>
      </Section>

      {/* todo - check later if this etire section can be optimised for define condtion page too */}
      <Section flexDirection="column" gap="16px">
        <OptionButtons
          options={OPERATOR_OPTIONS}
          selectedValue={criteriaState.entryRootCondition}
          handleClick={(newEl: string) => {
            criteriaState.setEntryRootCondition(newEl as ConditionType);
          }}
        />
        <Span fontSize="14px">
          {
            OPERATOR_OPTIONS_INFO[
              criteriaState.entryRootCondition as keyof typeof OPERATOR_OPTIONS_INFO
            ].head
          }
          <Span color={theme.textColor?.modalSubHeadingText}>
            {' '}
            {
              OPERATOR_OPTIONS_INFO[
                criteriaState.entryRootCondition as keyof typeof OPERATOR_OPTIONS_INFO
              ].tail
            }
          </Span>
        </Span>
      
      <ConditionsComponent 
        conditionData={[
          [{ operator:  criteriaState.entryRootCondition }],
          ...generateMapping()
        ]}
        
        deleteFunction={(idx)=>{
          criteriaState.deleteEntryOptionsDataArray(idx)
        }}

        updateFunction={(idx)=>{
          criteriaState.selectEntryOptionsDataArrayForUpdate(idx)
          if(handleNext){
            handleNext()
          }
        }}
      
      /> 

      <Button
        onClick={()=>{
          if(handleNext){
            criteriaState.setSelectedRule([])
            criteriaState.setSelectedCriteria(-1)
            handleNext()
          }
        }}
        customStyle={{
          color: `${theme.backgroundColor?.buttonBackground}`,
          fontSize: '15px',
          fontWeight: '500',
          border: `${theme.border?.modalInnerComponents}`,
          background: 'transparent',
        }}
      >
        + Add conditions
      </Button>
    </Section>
    </Section>
  );
};



export const CreateGroupType = ({
  onClose,
  handlePrevious,
  groupInputDetails,
  handleNext,
  entryCriteria
}: ModalHeaderProps & GroupTypeState) => {
  const [checked, setChecked] = useState<boolean>(true);
  const [groupEncryptionType, setGroupEncryptionType] = useState('');
  
  // const theme = useContext(ThemeContext);
  // const isMobile = useMediaQuery(device.mobileL);
  const groupInfoToast = useToast();

  const createGroupService = async () => {
    const groupInfo = {
      groupInfo: { ...groupInputDetails },
      groupType: groupEncryptionType,
    };
    console.log('created group with', groupInfo);
    onClose();
  };

  const verifyAndCreateGroup = async () => {
    if (groupEncryptionType.trim() === '') {
      showError('Group encryption type is not selected');
      return;
    }

    await createGroupService();
  };

  const showError = (errorMessage: string) => {
    groupInfoToast.showMessageToast({
      toastTitle: 'Error',
      toastMessage: errorMessage,
      toastType: 'ERROR',
      getToastIcon: (size) => <MdError size={size} color="red" />,
    });
  };

  return (
    <Section flexDirection="column" gap="32px">
      <ModalHeader
        title="Create Group"
        handleClose={onClose}
        handlePrevious={handlePrevious}
      />
      <OptionButtons
        options={GROUP_TYPE_OPTIONS}
        selectedValue={groupEncryptionType}
        handleClick={(newEl: string) => {
          setGroupEncryptionType(newEl);
          console.log('we called it');
        }}
      />

      <ToggleInput
        labelHeading="Gated Group"
        labelSubHeading="Turn this on for Token/NFT gating options"
        checked={checked}
        onToggle={() => setChecked(!checked)}
      />

      {checked && (
        <Section flexDirection="column" gap="32px">
          <AddConditionSection
            criteriaState={entryCriteria}
            handleNext={
              ()=>{
                // add new condtion
                // entryCriteria.


                if(handleNext){
                  handleNext()
                }
              }
            }
            {...ACCESS_TYPE_TITLE.ENTRY}
          />
          {/* <AddConditionSection
            handleNext={handleNext}
            {...ACCESS_TYPE_TITLE.CHAT}
          /> */}
        </Section>
      )}

      <Section gap="20px" flexDirection="column">
        <Button width="197px">Create Group</Button>
        <GatingRulesInformation />
      </Section>
    </Section>
  );
};
