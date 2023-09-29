
import React, { useContext,useState } from 'react';

import { ModalHeader } from '../reusables/Modal';
import OptionButtons, { OptionDescription } from '../reusables/OptionButtons';
import { Section, Span } from '../../reusables';
import { ToggleInput } from '../reusables';
import { Button } from '../reusables';
import { GroupTypeState, ModalHeaderProps } from './CreateGroupModal';

import { SpamIcon } from '../../../icons/SpamIcon';

import { ThemeContext } from '../theme/ThemeProvider';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { device } from '../../../config';
import useToast from '../reusables/NewToast';
import { MdError } from 'react-icons/md';



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
      CHAT:{
        heading: 'Conditions to Chat',
        subHeading: 'Add a condition to join or leave it open for everyone',
       
      },
  };

  

interface AddConditionProps {
    heading: string;
    subHeading: string;
  }
  const AddConditionSection = ({ heading, subHeading }: AddConditionProps) => {
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
        <Button
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
  
export const CreateGroupType = ({ onClose,handlePrevious,groupInputDetails }: ModalHeaderProps & GroupTypeState) => {
    const [checked, setChecked] = useState<boolean>(false);
    const [groupEncryptionType, setGroupEncryptionType] = useState('')
    const theme = useContext(ThemeContext);
    const isMobile = useMediaQuery(device.mobileL);
    const groupInfoToast = useToast();


    const createGroupService = async()=>{
      const groupInfo = {
        groupInfo:{...groupInputDetails},
        groupType:groupEncryptionType
      }
      console.log("created group with", groupInfo);
      onClose()      
    }

    const verifyAndCreateGroup = async()=>{
      if(groupEncryptionType.trim() === ""){
        showError("Group encryption type is not selected")
        return
      }

      await createGroupService();
    }

    const showError =(errorMessage:string)=>{
      groupInfoToast.showMessageToast({
        toastTitle: 'Error',
        toastMessage: errorMessage,
        toastType: 'ERROR',
        getToastIcon: (size) => <MdError size={size} color="red" />,
      });
    }

    return (
        <Section flexDirection="column" gap="32px" >
          <ModalHeader title="Create Group" handleClose={onClose} handlePrevious={handlePrevious} />
          <OptionButtons options={GROUP_TYPE_OPTIONS} selectedValue={groupEncryptionType} handleClick={(newEl:string)=>{
            setGroupEncryptionType(newEl)
            console.log("we called it");
          }}/>
  
          <ToggleInput
            labelHeading="Gated Group"
            labelSubHeading="Turn this on for Token/NFT gating options"
            checked={checked}
            onToggle={() => setChecked(!checked)}
          />
  
          {checked && (
            <Section flexDirection="column" gap='32px'>
              <AddConditionSection {...ACCESS_TYPE_TITLE.ENTRY}/>
              <AddConditionSection {...ACCESS_TYPE_TITLE.CHAT}/>
            </Section>
          )}
          <Section gap="20px" flexDirection="column">
            <Button width="197px" onClick={verifyAndCreateGroup}>Create Group</Button>
            <Section gap="4px">
              <SpamIcon />
              <Span color={theme.textColor?.modalSubHeadingText} fontSize="15px">
                Learn more about gating rules
              </Span>
            </Section>
          </Section>
        </Section>
    );
  };