import React, { useContext, useState } from 'react';

import {
  Button,
  DropDownInput,
  DropdownValueType,
  ModalHeader,
  TextInput,
} from '../reusables';
import { Section, Span } from '../../reusables';
import EthereumSvg from '../../../icons/ethereum.svg';
import PolygonSvg from '../../../icons/polygon.svg';
import BSCSvg from '../../../icons/bsc.svg';
import OptimismSvg from '../../../icons/optimisim.svg';

import useMediaQuery from '../../../hooks/useMediaQuery';

import { BLOCKCHAIN_NETWORK, device } from '../../../config';
import { GatingRulesInformation, ModalHeaderProps } from './CreateGroupModal';
import { useChatData } from '../../../hooks';
import { QuantityInput } from '../reusables/QuantityInput';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';
import { Checkbox } from '../reusables/Checkbox';
import OptionButtons from '../reusables/OptionButtons';
import { GUILD_COMPARISON_OPTIONS, INVITE_CHECKBOX_LABEL } from '../constants';
import {
  CATEGORY,
  DropdownCategoryValuesType,
  DropdownSubCategoryValuesType,
  SUBCATEGORY,
  TYPE,
  SubCategoryKeys,
  TypeKeys,
  ReadonlyInputType,
} from '../types';


const AddCriteria = ({
  handlePrevious,
  //handle add criteria
  handleNext,
  onClose,
}: ModalHeaderProps) => {
  const [selectedTypeValue, setSelectedTypeValue] = useState<number>(0);
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<number>(0);
  const [selectedSubCategoryValue, setSelectedSubCategoryValue] =
    useState<number>(0);
    const [guildComparison, setGuildComparison] = useState('')
  const [selectedChainValue, setSelectedChainValue] = useState<number>(0);
  const [contract, setContract] = useState<string>('');
  const [inviteCheckboxes, setInviteCheckboxes] = useState<{
    admin: boolean;
    owner: boolean;
  }>({ admin: false, owner: false });
  const [url, setUrl] = useState<string>('');
  const [guildId, setGuildId] = useState<string>('');
  const [specificRoleId, setSpecificRoleId] = useState<string>('');

  const [quantity, setQuantity] = useState<{ value: number; range: number }>({
    value: 0,
    range: 0,
  });
  const { env } = useChatData();
  const theme = useContext(ThemeContext);

  const isMobile = useMediaQuery(device.mobileL);

  const dropdownQuantityRangeValues: Array<DropdownValueType> = [
    {
      id: 0,
      title: 'Minimum',
      value: 'MINIMUM',
      function: () => setQuantity({ ...quantity, range: 0 }),
    },
    {
      id: 1,
      title: 'Maximum',
      value: 'MAXIMUM',
      function: () => setQuantity({ ...quantity, range: 1 }),
    },
  ];
  const dropdownTypeValues: Array<DropdownValueType> = [
    {
      id: 0,
      title: 'Push protocol',
      value: TYPE.PUSH,
      function: () => setSelectedTypeValue(0),
    },
    {
      id: 1,
      title: 'Guild',
      value: TYPE.GUILD,
      function: () => setSelectedTypeValue(1),
    },
  ];
  const dropdownCategoryValues: DropdownCategoryValuesType = {
    PUSH: [
      {
        id: 0,
        value: CATEGORY.ERC20,
        title: 'Token ERC20',
        function: () => setSelectedCategoryValue(0),
      },
      {
        id: 1,
        value: CATEGORY.ERC721,
        title: 'NFT ERC721',
        function: () => setSelectedCategoryValue(1),
      },
      {
        id: 2,
        value: CATEGORY.INVITE,
        title: 'Invite',
        function: () => setSelectedCategoryValue(2),
      },
      {
        id: 3,
        value: CATEGORY.CustomEndpoint,
        title: 'Custom Endpoint',
        function: () => setSelectedCategoryValue(3),
      },
    ],
    GUILD: {
      value: CATEGORY.ROLES,
      title: 'Roles',
    },
  };

  const tokenCategoryValues = [
    {
      id: 0,
      value: SUBCATEGORY.HOLDER,
      title: 'Holder',
      function: () => setSelectedSubCategoryValue(0),
    },
    {
      id: 1,
      value: SUBCATEGORY.OWENER,
      title: 'Owner',
      function: () => setSelectedSubCategoryValue(1),
    },
  ];
  const dropdownSubCategoryValues: DropdownSubCategoryValuesType = {
    ERC20: tokenCategoryValues,
    ERC721: tokenCategoryValues,
    INVITE: {
      value: SUBCATEGORY.DEFAULT,
      title: 'Default',
    },
    CustomEndpoint: [
      {
        id: 0,
        value: SUBCATEGORY.GET,
        title: 'Get',
        function: () => setSelectedSubCategoryValue(0),
      },
    ],
    ROLES: {
      value: SUBCATEGORY.DEFAULT,
      title: 'Default',
    },
  };

  const dropdownChainsValues: Array<DropdownValueType> = [
    {
      id: 0,
      value: BLOCKCHAIN_NETWORK[env].ETHEREUM,
      title: 'Ethereum',
      icon: EthereumSvg,
      function: () => setSelectedChainValue(0),
    },
    {
      id: 1,
      value: BLOCKCHAIN_NETWORK[env].POLYGON,
      title: 'Polygon',
      icon: PolygonSvg,
      function: () => setSelectedChainValue(1),
    },
    {
      id: 2,
      value: BLOCKCHAIN_NETWORK[env].BSC,
      title: 'BSC',
      icon: BSCSvg,
      function: () => setSelectedChainValue(2),
    },
    {
      id: 3,
      value: BLOCKCHAIN_NETWORK[env].OPTIMISM,
      title: 'Optimism',
      icon: OptimismSvg,
      function: () => setSelectedChainValue(3),
    },
  ];

  const getCategoryDropdownValues = () => {
    return dropdownCategoryValues[
      dropdownTypeValues[selectedTypeValue].value as TypeKeys
    ];
  };

  const getSelectedCategoryValue = () => {
    const category = getCategoryDropdownValues();
    if (Array.isArray(category))
      return (category as DropdownValueType[])[selectedCategoryValue].value!;
    else return category.value! as SubCategoryKeys;
  };

  const getSelectedSubCategoryValue = () => {
    const subCategory = getSubCategoryDropdownValues();
    if (Array.isArray(subCategory))
      return (subCategory as DropdownValueType[])[selectedCategoryValue].value!;
    else return subCategory.value! as SubCategoryKeys;
  };

  const checkIfTokenNFT = () => {
    const category = getSelectedCategoryValue();
    if (category === CATEGORY.ERC20 || category === CATEGORY.ERC721)
      return true;

    return false;
  };

  const checkIfCustomEndpoint = () => {
    const category = getSelectedCategoryValue();
    if (category === CATEGORY.CustomEndpoint) return true;
    return false;
  };

  const checkIfPushInvite = () => {
    const accessType = dropdownTypeValues[selectedTypeValue].value;
    if (accessType === TYPE.PUSH) {
      const category = getSelectedCategoryValue();
      if (category === CATEGORY.INVITE) return true;
    }

    return false;
  };

  const checkIfGuild = () => {
    const accessType = dropdownTypeValues[selectedTypeValue].value;
    if (accessType === TYPE.GUILD) {
      return true;
    }

    return false;
  };

  console.log(checkIfPushInvite());

  const getSubCategoryDropdownValues = () => {
    const category = getCategoryDropdownValues();
    console.log(category);
    console.log(selectedCategoryValue);
    console.log((category as DropdownValueType[])[selectedCategoryValue]);
    if (Array.isArray(category))
      return dropdownSubCategoryValues[
        (category as DropdownValueType[])[selectedCategoryValue]
          .value as SubCategoryKeys
      ];
    else return dropdownSubCategoryValues[category.value as SubCategoryKeys];
  };

  const onQuantityChange = (e: any) => {
    setQuantity({ ...quantity, value: e.target.value });
  };

  return (
    <Section
      flexDirection="column"
      gap="25px"
      width={isMobile ? '300px' : '400px'}
    >
      <Section margin="0 0 10px 0">
        <ModalHeader
          handleClose={onClose}
          handlePrevious={handlePrevious}
          title="Add Criteria"
        />
      </Section>
      <DropDownInput
        labelName="Type"
        selectedValue={selectedTypeValue}
        dropdownValues={dropdownTypeValues}
      />
      {Array.isArray(getCategoryDropdownValues()) ? (
        <DropDownInput
          labelName="Gating Category"
          selectedValue={selectedCategoryValue}
          dropdownValues={getCategoryDropdownValues() as DropdownValueType[]}
        />
      ) : (
        <TextInput
          labelName="Gating category"
          inputValue={(getCategoryDropdownValues() as ReadonlyInputType).title}
          disabled={true}
          customStyle={{
            background: theme.backgroundColor?.modalHoverBackground,
          }}
        />
      )}

      {Array.isArray(getSubCategoryDropdownValues()) ? (
        <DropDownInput
          labelName="Sub-Category"
          selectedValue={selectedSubCategoryValue}
          dropdownValues={getSubCategoryDropdownValues() as DropdownValueType[]}
        />
      ) : (
        <TextInput
          labelName="Sub-category"
          inputValue={(getSubCategoryDropdownValues()  as ReadonlyInputType)?.title}
          disabled={true}
          customStyle={{
            background: theme.backgroundColor?.modalHoverBackground,
          }}
        />
      )}
      {/* shift to minor components  leave for now*/}
      {checkIfTokenNFT() && (
        <>
          <DropDownInput
            labelName="Blockchain"
            selectedValue={selectedChainValue}
            dropdownValues={dropdownChainsValues}
          />
          <TextInput
            labelName="Contract"
            inputValue={contract}
            onInputChange={(e: any) => setContract(e.target.value)}
            placeholder="e.g. 0x123..."
          />
          <QuantityInput
            dropDownValues={dropdownQuantityRangeValues}
            labelName="Quantity"
            inputValue={quantity}
            onInputChange={onQuantityChange}
            placeholder="e.g. 1.45678"
            unit={'TOKEN'}
          />
        </>
      )}

      {checkIfCustomEndpoint() && (
        <TextInput
          labelName="URL"
          inputValue={url}
          onInputChange={(e: any) => setUrl(e.target.value)}
          placeholder="e.g. abc.com"
        />
      )}
      {checkIfPushInvite() && (
        <Section flexDirection="column" gap="10px">
          {Object.keys(INVITE_CHECKBOX_LABEL).map((key) => (
            <Checkbox
              labelName={
                INVITE_CHECKBOX_LABEL[key as keyof typeof INVITE_CHECKBOX_LABEL]
              }
              onToggle={() =>
                setInviteCheckboxes({
                  ...inviteCheckboxes,
                  [key]:
                    !inviteCheckboxes[
                      key as keyof typeof INVITE_CHECKBOX_LABEL
                    ],
                })
              }
              checked={
                inviteCheckboxes[key as keyof typeof INVITE_CHECKBOX_LABEL]
              }
            />
          ))}
        </Section>
      )}

      {checkIfGuild() && (
        <>
          <TextInput
            labelName="ID"
            inputValue={guildId}
            onInputChange={(e: any) => setGuildId(e.target.value)}
            placeholder="e.g. 4687"
          />
          <OptionButtons
            options={GUILD_COMPARISON_OPTIONS}
            totalWidth="410px"
            selectedValue={guildComparison}
            handleClick={(newEl:string)=>{
              setGuildComparison(newEl)}}
          />

          <TextInput
            labelName="Specific Role"
            inputValue={specificRoleId}
            onInputChange={(e: any) => setSpecificRoleId(e.target.value)}
            placeholder="e.g. 4687"
          />
        </>
      )}
      <Button width="197px" onClick={handleNext}>
        Add
      </Button>
      <GatingRulesInformation />
    </Section>
  );
};

export default AddCriteria;

//styles
