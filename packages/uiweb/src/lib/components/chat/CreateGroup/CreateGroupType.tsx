import React, { useContext, useState } from 'react';

import { MdError } from 'react-icons/md';

import { ModalHeader } from '../reusables/Modal';
import OptionButtons, { OptionDescription } from '../reusables/OptionButtons';
import { Section, Span } from '../../reusables';
import { ToggleInput } from '../reusables';
import { Button } from '../reusables';
import { GatingRulesInformation, ModalHeaderProps } from './CreateGroupModal';
import { GroupTypeState } from './CreateGroupModal';

import { ThemeContext } from '../theme/ThemeProvider';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { device } from '../../../config';
import useToast from '../reusables/NewToast';
import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_INFO } from '../constants';
import { ConditionArray } from '../exportedTypes';
import ConditionsComponent from './ConditionsComponent';
import { OperatorContainer } from './OperatorContainer';

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
}
const AddConditionSection = ({
  heading,
  subHeading,
  handleNext,
}: AddConditionProps) => {
    //todo - dummy data to be removed after we get condition data

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

  const dummySingleCondtionData = dummyConditonsData[2];
  const theme = useContext(ThemeContext);
  const [conditionOperator, setConditionOperator] = useState<string>(dummyConditonsData[0][0]?.operator as string);


 


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

      <Section margin='20px 0 10px 0'>
        <OperatorContainer
          operator={conditionOperator}
          setOperator={setConditionOperator}
        />
      </Section>
      <ConditionsComponent conditionData={dummyConditonsData} />

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
}: ModalHeaderProps & GroupTypeState) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [groupEncryptionType, setGroupEncryptionType] = useState('');
  const theme = useContext(ThemeContext);
  const isMobile = useMediaQuery(device.mobileL);
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
            handleNext={handleNext}
            {...ACCESS_TYPE_TITLE.ENTRY}
          />
          <AddConditionSection
            handleNext={handleNext}
            {...ACCESS_TYPE_TITLE.CHAT}
          />
        </Section>
      )}

      <Section gap="20px" flexDirection="column">
        <Button width="197px">Create Group</Button>
        <GatingRulesInformation />
      </Section>
    </Section>
  );
};
