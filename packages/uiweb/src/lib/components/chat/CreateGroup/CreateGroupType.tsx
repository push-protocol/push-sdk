
import React, { useContext, useState } from 'react';

import { ModalHeader } from '../reusables/Modal';
import OptionButtons, { OptionDescription } from '../reusables/OptionButtons';
import { Section, Span } from '../../reusables';
import { ToggleInput } from '../reusables';
import { Button } from '../reusables';
import { GatingRulesInformation, ModalHeaderProps } from './CreateGroupModal';

import { SpamIcon } from '../../../icons/SpamIcon';

import { ThemeContext } from '../theme/ThemeProvider';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { device } from '../../../config';
import { AddButtons } from './AddButtons';
import Criteria from './Criteria';
import MultipleCriterias from './MultipleCriterias';


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
}
export const AddConditionSection = ({ heading, subHeading, handleNext }: AddConditionProps) => {
  const theme = useContext(ThemeContext);

  return (
    <Section
      // margin="20px 0px 10px 0px"
      alignItems="start"
      flexDirection="column"
      gap='5px'
    >
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
      <AddButtons handleNext={handleNext} title={'+ Add conditions'} />
    </Section>
  );
};

export const CreateGroupType = ({ onClose, handlePrevious, handleNext }: ModalHeaderProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  const theme = useContext(ThemeContext);

  const criteriaOptions = [
    {
      id: 0,
      type: 'Token',
      value: '1.0 ETH',
      title: 'Token',
      function: () => console.log("Token")
  }
  ]

  const multiplecriteriaOptions = [
    {
        id: 0,
        type: 'Token',
        value: '1.0 ETH',
        title: 'Token',
        function: () => console.log("Token")
    },
    {
        id: 1,
        type: 'Token',
        value: '1.0 ETH',
        title: 'Token',
        function: () => console.log("NFT")
    }
]

  const isMobile = useMediaQuery(device.mobileL);
  console.log(isMobile)
  return (
    <Section flexDirection="column" gap="32px" >
      <ModalHeader title="Create Group" handleClose={onClose} handlePrevious={handlePrevious} />
      <OptionButtons options={GROUP_TYPE_OPTIONS} />

      <ToggleInput
        labelHeading="Gated Group"
        labelSubHeading="Turn this on for Token/NFT gating options"
        checked={checked}
        onToggle={() => setChecked(!checked)}
      />

      {checked && (
        <Section flexDirection="column" gap='32px'>
          <OptionButtons options={GATING_TYPE_OTPIONS} />
          <Criteria width='350px' dropdownValues={criteriaOptions} />
          <MultipleCriterias dropdownValues={multiplecriteriaOptions}/>
          <AddConditionSection handleNext={handleNext} {...ACCESS_TYPE_TITLE.ENTRY} />
          <AddConditionSection handleNext={handleNext} {...ACCESS_TYPE_TITLE.CHAT} />
        </Section>
      )}
      <Section gap="20px" flexDirection="column">
        <Button width="197px">Create Group</Button>
       < GatingRulesInformation/>
      </Section>
    </Section>
  );
};

