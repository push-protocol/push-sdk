import { useContext, useState } from 'react';

import { MdCheckCircle, MdError } from 'react-icons/md';
import styled from 'styled-components';

import { ModalHeader } from '../reusables/Modal';
import OptionButtons, { OptionDescription } from '../reusables/OptionButtons';
import { Section, Span, Spinner } from '../../reusables';
import { ToggleInput } from '../reusables';
import { Button } from '../reusables';
import { GatingRulesInformation, ModalHeaderProps } from './CreateGroupModal';
import { GroupTypeState } from './CreateGroupModal';
import { ThemeContext } from '../theme/ThemeProvider';
import useToast from '../reusables/NewToast';
import {
  ConditionType,
  CriteriaStateType,
} from '../types/tokenGatedGroupCreationType';
import ConditionsComponent from './ConditionsComponent';
import { OperatorContainer } from './OperatorContainer';
import { SelectedCriteria } from '../../../hooks/chat/useCriteriaState';
import { useCreateGatedGroup } from '../../../hooks/chat/useCreateGatedGroup';
import { GrouInfoType as GroupInfoType } from '../types';

import { ACCESS_TYPE_TITLE } from '../constants';
import { IChatTheme } from '../exportedTypes';

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

  const generateMapping = () => {
    return criteriaState.entryOptionsDataArray.map((rule, idx) => [
      { operator: criteriaState.entryOptionTypeArray[idx] },
      ...rule.map((el) => el),
    ]);
  };

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

      {criteriaState.entryOptionsDataArray.length > 1 && (
        <Section margin="20px 0 10px 0">
          <OperatorContainer
            operator={criteriaState.entryRootCondition}
            setOperator={(newEl: string) => {
              criteriaState.setEntryRootCondition(newEl as ConditionType);
            }}
          />
        </Section>
      )}
      <ConditionSection
        width="100%"
        overflow="hidden auto"
        maxHeight="20rem"
        theme={theme}
        padding="5px 4px 5px 0"
      >
        <ConditionsComponent
          conditionData={[
            [{ operator: criteriaState.entryRootCondition }],
            ...generateMapping(),
          ]}
          deleteFunction={(idx) => {
            criteriaState.deleteEntryOptionsDataArray(idx);
          }}
          updateFunction={(idx) => {
            criteriaState.selectEntryOptionsDataArrayForUpdate(idx);
            if (handleNext) {
              handleNext();
            }
          }}
        />
      </ConditionSection>

      <Button
        onClick={() => {
          if (handleNext) {
            criteriaState.setSelectedRule([]);
            criteriaState.setSelectedCriteria(-1);
            handleNext();
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
  );
};

export const CreateGroupType = ({
  onClose,
  handlePrevious,
  groupInputDetails,
  handleNext,
  criteriaStateManager,
}: ModalHeaderProps & GroupTypeState) => {
  const [checked, setChecked] = useState<boolean>(true);
  const [groupEncryptionType, setGroupEncryptionType] = useState(
    GROUP_TYPE_OPTIONS[0].value
  );

  const { createGatedGroup, loading } = useCreateGatedGroup();
  const groupInfoToast = useToast();

  const createGroupService = async () => {
    // TODO:use actual data instead of dummy data
    // const groupInfo = {
    //   groupInfo: { ...groupInputDetails },
    //   groupType: groupEncryptionType,
    // };
    const dummyGrouInfo: GroupInfoType = {
      groupName: 'Push Group Chat 3',
      groupDescription: 'This is the oficial group for Push Protocol',
      groupImage:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=',
      isPublic: true,
    };

    const rules: any = criteriaStateManager.generateRule();
    await createGatedGroup(dummyGrouInfo, rules);
    groupInfoToast.showMessageToast({
      toastTitle: 'Success',
      toastMessage: 'Group created successfully',
      toastType: 'SUCCESS',
      getToastIcon: (size) => <MdCheckCircle size={size} color="green" />,
    });
    onClose();
  };

  const verifyAndCreateGroup = async () => {
    // TODO:validate the fields
    // if (groupEncryptionType.trim() === '') {
    //   showError('Group encryption type is not selected');
    //   return;
    // }

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
            criteriaState={criteriaStateManager.entryCriteria}
            handleNext={() => {
              if (handleNext) {
                criteriaStateManager.setSelectedCriteria(
                  SelectedCriteria.ENTRY
                );
                handleNext();
              }
            }}
            {...ACCESS_TYPE_TITLE.ENTRY}
          />
          <AddConditionSection
            handleNext={() => {
              if (handleNext) {
                criteriaStateManager.setSelectedCriteria(SelectedCriteria.CHAT);
                handleNext();
              }
            }}
            criteriaState={criteriaStateManager.chatCriteria}
            {...ACCESS_TYPE_TITLE.CHAT}
          />
        </Section>
      )}

      <Section gap="20px" flexDirection="column">
        <Button width="197px" onClick={verifyAndCreateGroup}>
          {!loading && 'Create Group'}
          {loading && <Spinner size="20" color="#fff" />}
        </Button>
        <GatingRulesInformation />
      </Section>
    </Section>
  );
};

//styles
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
