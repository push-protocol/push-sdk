import React, { useContext, useEffect, useState } from 'react';

import { MdError } from 'react-icons/md';

import { ModalHeader } from '../reusables/Modal';
import OptionButtons, { OptionDescription } from '../reusables/OptionButtons';
import { Section, Span } from '../../reusables';
import { ToggleInput } from '../reusables';
import { Button } from '../reusables';
import { GatingRulesInformation, ModalHeaderProps } from './CreateGroupModal';
import { GroupTypeState } from './CreateGroupModal';

import { SpamIcon } from '../../../icons/SpamIcon';
import { ThemeContext } from '../theme/ThemeProvider';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { device } from '../../../config';
import { AddButtons } from './AddButtons';
import Criteria from './Criteria';
import MultipleCriterias from './MultipleCriterias';
import useToast from '../reusables/NewToast';
import {ConditionType, CriteriaStateType, Rule, useCriteriaState} from './Type'
import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_INFO } from '../constants';
import { SingleAndMultipleCriteria } from './SingleAndMultipleCriteria';


const GATING_TYPE_OTPIONS: Array<OptionDescription> = [
  {
    heading: 'All',
    value: 'All',
  },
  {
    heading: 'Any',
    value: 'Any',
  },
];

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


export const rulesToCriteriaOptions = (rules:Rule[])=>{
  return rules.map((rule,idx)=>({
    id:idx,
    type: rule.type,
    value: rule.data.amount,
    title: rule.category,
    function: () => console.log('Token'),
  }))
}


const AddConditionSection = ({
  heading,
  subHeading,
  handleNext,
  criteriaState,
}: AddConditionProps) => {
  const theme = useContext(ThemeContext);

  /** todo - dummy data to be removed after we get condition data
   *  and check for the chat and entry conditions
   */
  interface ConditionData {
    operator?: string;
    type?: string;
    category?: string;
    subcategory?: string;
    data?: Record<string, any>;
  }
  
  type ConditionArray = [ConditionData] | ConditionData[];
  
  const dummyConditonsData: ConditionArray[] = [
    [{ operator: 'any' }],
    [{
      type: 'PUSH',
      category: 'ERC20',
      subcategory: 'holder',
      data: {
        contract: 'eip155:1:0xf418588522d5dd018b425E472991E52EBBeEEEEE',
        amount: 1,
        decimals: 18,
      },
    }],
    [
      { operator: 'all' } ,
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


  const dummySingleCondtionData = dummyConditonsData[2];

  const criteriaOptions = [
    {
      id: 0,
      type: 'Token',
      value: '1.0 ETH',
      title: 'Token',
      function: () => console.log('Token'),
    },
  ];

  const multiplecriteriaOptions = [
    {
      id: 0,
      type: 'Token',
      value: '1.0 ETH',
      title: 'Token',
      function: () => console.log('Token'),
    },
    {
      id: 1,
      type: 'Token',
      value: '1.0 ETH',
      title: 'Token',
      function: () => console.log('NFT'),
    },
  ];
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
        {
         criteriaState.entryOptionsDataArray.map((ruleArray,idx) => (
           <SingleAndMultipleCriteria dropdownValues={rulesToCriteriaOptions(ruleArray)} conditionType={criteriaState.entryOptionTypeArray[idx]}/>
         )) 
        }
      </Section>
      <Button
        onClick={handleNext}
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
