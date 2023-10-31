import { Dispatch, SetStateAction } from 'react';
import { DropdownValueType } from '../reusables';
import {
  CATEGORY,
  Data,
  DropdownCategoryValuesType,
  DropdownSubCategoryValuesType,
  SubCategoryKeys,
  TYPE,
  TypeKeys,
} from '../types';
import { tokenFetchHandler } from './tokenHelpers';

type InputFunctionParams = {
  dropdownCategoryValues?: DropdownCategoryValuesType;
  dropdownTypeValues?: Array<DropdownValueType>;
  selectedTypeValue?: number;
  selectedCategoryValue?: number;
};

export const getCategoryDropdownValues = ({
  dropdownCategoryValues,
  dropdownTypeValues,
  selectedTypeValue,
}: InputFunctionParams) => {
  return dropdownCategoryValues![
    dropdownTypeValues![selectedTypeValue!]?.value as TypeKeys
  ];
};

export const getSelectedCategoryValue = ({
  dropdownCategoryValues,
  dropdownTypeValues,
  selectedCategoryValue,
  selectedTypeValue,
}: InputFunctionParams) => {
  const category = getCategoryDropdownValues({
    dropdownCategoryValues,
    dropdownTypeValues,
    selectedTypeValue,
  });
  if (Array.isArray(category))
    return (category as DropdownValueType[])[selectedCategoryValue!].value!;
  else return category.value! as SubCategoryKeys;
};

export const getSelectedSubCategoryValue = ({
  dropdownCategoryValues,
  dropdownTypeValues,
  selectedCategoryValue,
  dropdownSubCategoryValues,
  selectedTypeValue,
}: InputFunctionParams & {
  dropdownSubCategoryValues: DropdownSubCategoryValuesType;
}) => {
  const subCategory = getSubCategoryDropdownValues({
    dropdownCategoryValues,
    dropdownTypeValues,
    selectedCategoryValue,
    dropdownSubCategoryValues,
    selectedTypeValue,
  });
  if (Array.isArray(subCategory))
    return (subCategory as DropdownValueType[])[selectedCategoryValue!].value!;
  else return subCategory.value! as SubCategoryKeys;
};

export const checkIfTokenNFT = ({
  dropdownCategoryValues,
  dropdownTypeValues,
  selectedCategoryValue,
  selectedTypeValue,
}: InputFunctionParams) => {
  const category = getSelectedCategoryValue({
    dropdownCategoryValues,
    dropdownTypeValues,
    selectedTypeValue,
    selectedCategoryValue,
  });
  if (category === CATEGORY.ERC20 || category === CATEGORY.ERC721) return true;

  return false;
};

export const checkIfCustomEndpoint = ({
  dropdownCategoryValues,
  dropdownTypeValues,
  selectedCategoryValue,
  selectedTypeValue,
}: InputFunctionParams) => {
  const category = getSelectedCategoryValue({
    dropdownCategoryValues,
    selectedTypeValue,
    dropdownTypeValues,
    selectedCategoryValue,
  });
  if (category === CATEGORY.CustomEndpoint) return true;
  return false;
};

export const checkIfPushInvite = ({
  dropdownCategoryValues,
  dropdownTypeValues,
  selectedCategoryValue,
  selectedTypeValue,
}: InputFunctionParams) => {
  const accessType = dropdownTypeValues![selectedTypeValue!].value;
  if (accessType === TYPE.PUSH) {
    const category = getSelectedCategoryValue({
      dropdownCategoryValues,
      selectedTypeValue,
      dropdownTypeValues,
      selectedCategoryValue,
    });
    if (category === CATEGORY.INVITE) return true;
  }

  return false;
};

export const checkIfGuild = (
  dropdownTypeValues: Array<DropdownValueType>,
  selectedTypeValue: number
) => {
  const accessType = dropdownTypeValues[selectedTypeValue].value;
  if (accessType === TYPE.GUILD) {
    return true;
  }

  return false;
};

export const getSubCategoryDropdownValues = ({
  dropdownCategoryValues,
  dropdownTypeValues,
  selectedCategoryValue,
  dropdownSubCategoryValues,
  selectedTypeValue,
}: InputFunctionParams & {
  dropdownSubCategoryValues: DropdownSubCategoryValuesType;
}) => {
  const category = getCategoryDropdownValues({
    dropdownCategoryValues,
    dropdownTypeValues,
    selectedCategoryValue,
    selectedTypeValue,
  });
  if (Array.isArray(category))
    return dropdownSubCategoryValues[
      (category as DropdownValueType[])[selectedCategoryValue!]
        .value as SubCategoryKeys
    ];
  else return dropdownSubCategoryValues[category.value as SubCategoryKeys];
};

export const getSeletedType = ({
  dropdownTypeValues,
  selectedTypeValue,
}: InputFunctionParams) => {
  return dropdownTypeValues![selectedTypeValue!].value || 'PUSH';
};

export const getSelectedCategory = ({
  dropdownCategoryValues,
  selectedCategoryValue,
}: InputFunctionParams) => {
  const category: string =
    (dropdownCategoryValues!['PUSH'] as DropdownValueType[])[
      selectedCategoryValue!
    ].value || CATEGORY.ERC20;

  return category;
};

export const getSelectedChain = (
  dropdownChainsValues: Array<DropdownValueType>,
  selectedChainValue: number
) => {
  return dropdownChainsValues[selectedChainValue].value || 'eip155:1';
};

type FetchContractInfoParamType = {
  setValidationErrors: (prev: any) => void;
  setUnit: Dispatch<SetStateAction<string>>;
  setDecimals: Dispatch<SetStateAction<number>>;
  contract: string;
  dropdownChainsValues: Array<DropdownValueType>;
  selectedChainValue: number;
} & InputFunctionParams;

export const fetchContractInfo = async ({
  setValidationErrors,
  selectedCategoryValue,
  selectedTypeValue,
  dropdownCategoryValues,
  dropdownTypeValues,
  contract,
  setUnit,
  setDecimals,
  selectedChainValue,
  dropdownChainsValues,
}: FetchContractInfoParamType) => {
  setValidationErrors((prev: any) => ({ ...prev, tokenError: undefined }));

  const _type = getSeletedType({ selectedTypeValue, dropdownTypeValues });
  const _category: string = getSelectedCategory({
    dropdownCategoryValues,
    selectedCategoryValue,
  });
  const _chainInfo = getSelectedChain(dropdownChainsValues, selectedChainValue);

  await tokenFetchHandler(
    contract,
    _type,
    _category,
    _chainInfo,
    setUnit,
    setDecimals
  );
};

type GetCriteriaDataParamType = {
  type: string;
  category: string;
  contract: string;
  dropdownChainsValues: Array<DropdownValueType>;
  dropdownQuantityRangeValues: Array<DropdownValueType>;
  selectedChainValue: number;
  decimals: number;
  unit: string;
  url: string;
  guildId: string;
  specificRoleId: string;
  guildComparison: string;
  inviteCheckboxes: {
    admin: boolean;
    owner: boolean;
  };
  quantity: {
    value: number;
    range: number;
  };
} ;

export const getCriteriaData = ({
  type,
  category,
  contract,
  quantity,
  decimals,
  unit,
  url,
  inviteCheckboxes,
  guildComparison,
  specificRoleId,
  guildId,
  dropdownQuantityRangeValues,
  selectedChainValue,
  dropdownChainsValues,
}: GetCriteriaDataParamType): Data => {
  if (type === 'PUSH') {
    if (category === CATEGORY.ERC20 || category === CATEGORY.ERC721) {
      const selectedChain =
        dropdownChainsValues[selectedChainValue].value || 'eip155:1';
      return {
        contract: `${selectedChain}:${contract}`,
        amount: quantity.value,
        comparison: dropdownQuantityRangeValues[quantity.range].value,
        decimals: category === CATEGORY.ERC20 ? decimals : undefined,
        token: unit,
      };
    } else if (category === CATEGORY.INVITE) {
      const _inviteRoles = [];
      if (inviteCheckboxes.admin) {
        _inviteRoles.push('ADMIN');
      }
      if (inviteCheckboxes.owner) {
        _inviteRoles.push('OWNER');
      }

      return {
        inviterRoles: _inviteRoles as ['OWNER' | 'ADMIN'],
      };
    } else {
      return {
        url: url,
      };
    }
  } else {
    return {
      id: guildId,
      comparison: guildComparison === 'specific' ? '' : guildComparison,
      role: guildComparison === 'specific' ? specificRoleId : '*',
    };
  }
};
