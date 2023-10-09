import { DropdownValueType } from '../reusables';

export const TYPE = {
  PUSH: 'PUSH',
  GUILD: 'GUILD',
} as const;

export type TypeKeys = (typeof TYPE)[keyof typeof TYPE];

export const CATEGORY = {
  ERC20: 'ERC20',
  ERC721: 'ERC721',
  INVITE: 'INVITE',
  CustomEndpoint: 'CustomEndpoint',
  ROLES: 'ROLES',
} as const;

export const UNIT = {
  ERC20: 'TOKEN',
  ERC721: 'NFT',
} as const;
export type UnitKeys = (typeof UNIT)[keyof typeof UNIT];
export const SUBCATEGORY = {
  HOLDER: 'holder',
  OWENER: 'owner',
  //   INVITE: 'INVITE',
  GET: 'GET',
  DEFAULT: 'DEFAULT',
} as const;

export type ReadonlyInputType = {
    value: string;
    title: string;
  };
export type InputType =
  | DropdownValueType[]
  | ReadonlyInputType;
export type SubCategoryKeys = (typeof CATEGORY)[keyof typeof CATEGORY];

export type DropdownCategoryValuesType = {
  [key in TypeKeys]: InputType;
};

export type DropdownSubCategoryValuesType = {
  [key in SubCategoryKeys]: InputType;
};

export const TOKEN_NFT_COMPARISION = {
'>':'or more',
'>=': 'equal or more',
'<': 'or less',
'<=': 'equal or less',
'==': '',
'!=':'not'
} as const;

export type TokenNftComparision = keyof typeof TOKEN_NFT_COMPARISION;

export * from './tokenGatedGroupCreationType'