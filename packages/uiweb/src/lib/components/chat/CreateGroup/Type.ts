import { useState } from "react";

export interface Data {
  contract: string;
  amount: number;
  decimals: number;
}

export interface Rule {
  type: 'PUSH' | 'GUILD';
  category: 'ERC20' | 'ERC721';
  subcategory: 'holder' | 'owner';
  data: Data;
}

export type Condition = Rule | AnyCondition | AllCondition;

interface AnyCondition {
  any: Condition[];
}

interface AllCondition {
  all: Condition[];
}

export interface ChatConditions {
  conditions: AllCondition | AnyCondition;
}
// need to add/edit/delete
const chatCondition: ChatConditions = {
  conditions: {
    all: [
      {
        any: [
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
        ],
      },
      {
        any: [
          {
            all: [
              {
                type: 'PUSH',
                category: 'ERC20',
                subcategory: 'holder',
                data: {
                  contract: 'eip155:1:0xYourContractAddressForC',
                  amount: 1,
                  decimals: 18,
                },
              },
              {
                type: 'PUSH',
                category: 'ERC20',
                subcategory: 'holder',
                data: {
                  contract: 'eip155:137:0xYourContractAddressForD',
                  amount: 1,
                  decimals: 18,
                },
              },
            ],
          },
        ],
      },
    ],
  },
};



export type ConditionType = 'any' | 'all'

export interface CriteriaStateType{
  entryRootCondition: ConditionType;
  setEntryRootCondition: React.Dispatch<React.SetStateAction<ConditionType>>;
  entryOptionTypeArray: ConditionType[];
  setEntryOptionTypeArray: React.Dispatch<React.SetStateAction<ConditionType[]>>;
  entryOptionsDataArray: Rule[][];
  setEntryOptionsDataArray: React.Dispatch<React.SetStateAction<Rule[][]>>;
}

export const useCriteriaState = ():CriteriaStateType=>{
  const [entryRootCondition, setEntryRootCondition] = useState<ConditionType>('all')
  const [entryOptionTypeArray, setEntryOptionTypeArray] = useState<ConditionType[]>([])
  const [entryOptionsDataArray, setEntryOptionsDataArray] = useState<Rule[][]>([])

  return {
    entryRootCondition, setEntryRootCondition,
    entryOptionTypeArray, setEntryOptionTypeArray,
    entryOptionsDataArray, setEntryOptionsDataArray
  }
}