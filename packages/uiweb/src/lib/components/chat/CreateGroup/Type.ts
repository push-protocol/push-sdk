import { useState } from "react";

export interface PushData{
  contract?: string;
  amount?: number;
  decimals?: number;
  inviterRoles?: 'OWNER' | 'ADMIN',
  url?:string
}

export interface GuildData{
  id:string;
  role:string;
  comparison:string;
}

export type Data = PushData | GuildData

export interface Rule {
  type: 'PUSH' | 'GUILD';
  // category: 'ERC20' | 'ERC721';
  category: string;
  subcategory:string;
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
  entryRuleTypeCondition: ConditionType;
  setEntryRuleTypeCondition: React.Dispatch<React.SetStateAction<ConditionType>>
  entryOptionTypeArray: ConditionType[];
  setEntryOptionTypeArray: React.Dispatch<React.SetStateAction<ConditionType[]>>;
  entryOptionsDataArray: Rule[][];
  setEntryOptionsDataArray: React.Dispatch<React.SetStateAction<Rule[][]>>;
  selectedCriteria:number;
  setSelectedCriteria: React.Dispatch<React.SetStateAction<number>>;
  selectedRules:Rule[];
  setSelectedRule: React.Dispatch<React.SetStateAction<Rule[]>>;
  addNewCondtion: () => void;
  addNewRule: (newRule: Rule) => void;
  deleteRule: (idx: number) => void;
  deleteEntryOptionsDataArray: (idx: number) => void;
  selectEntryOptionsDataArrayForUpdate: (idx: number)=>void;
  entryOptionsDataArrayUpdate:number;
  isCondtionUpdateEnabled: () => boolean;
  updateCondition: () => void;
  updateCriteriaIdx: number;
  setUpdateCriteriaIdx: React.Dispatch<React.SetStateAction<number>>;
  isUpdateCriteriaEnabled: () => boolean
}

export const useCriteriaState = ():CriteriaStateType=>{
  const [entryRootCondition, setEntryRootCondition] = useState<ConditionType>('all')
  const [entryRuleTypeCondition, setEntryRuleTypeCondition] = useState<ConditionType>('all')
  const [entryOptionTypeArray, setEntryOptionTypeArray] = useState<ConditionType[]>([])
  const [entryOptionsDataArray, setEntryOptionsDataArray] = useState<Rule[][]>([])
  
  const [selectedCriteria, setSelectedCriteria] = useState(-1);
  const [selectedRules, setSelectedRule] = useState<Rule[]>([])

  const [entryOptionsDataArrayUpdate, setEntryOptionsDataArrayUpdate] = useState(-1)
  const [updateCriteriaIdx, setUpdateCriteriaIdx] = useState(-1)
  
  const addNewRule = (newRule:Rule)=>{
    if (selectedCriteria === -1){
      setSelectedCriteria(entryOptionTypeArray.length)
    }

    if(updateCriteriaIdx !== -1){
      // update existing
      const _rulesToUpdate = [...selectedRules]
      _rulesToUpdate[updateCriteriaIdx] = newRule
      setSelectedRule(_rulesToUpdate)
    }else{
      // add new
      setSelectedRule(prev =>[...prev,newRule])
    }

  }

  const deleteRule = (idx:number)=>{
    const removedRule = [...selectedRules]
    removedRule.splice(idx,1)
    setSelectedRule(removedRule)
  }

  const addNewCondtion = ()=>{
    setEntryOptionTypeArray(prev => [...prev,entryRuleTypeCondition])
    setEntryOptionsDataArray(prev => [...prev,[...selectedRules]])
    setSelectedRule([])
  }

  const updateCondition = ()=>{
    const optionTypeArrayUpdated = [...entryOptionTypeArray]
    optionTypeArrayUpdated[entryOptionsDataArrayUpdate] = entryRuleTypeCondition

    const entryOptionsDataArrayUpdated = [...entryOptionsDataArray]
    entryOptionsDataArrayUpdated[entryOptionsDataArrayUpdate] = [...selectedRules]
    
    setEntryOptionTypeArray(optionTypeArrayUpdated) 
    setEntryOptionsDataArray(entryOptionsDataArrayUpdated)

    setSelectedRule([])
  }

  const isCondtionUpdateEnabled = ()=>{
    return entryOptionsDataArrayUpdate !== -1
  }

  const deleteEntryOptionsDataArray = (idx:number)=>{
    const removedRule = [...entryOptionsDataArray]
    removedRule.splice(idx,1)
    setEntryOptionsDataArray(removedRule) 
  }

  const selectEntryOptionsDataArrayForUpdate = (idx:number)=>{
    setEntryOptionsDataArrayUpdate(idx)
  }

  const isUpdateCriteriaEnabled = ()=>{
    return updateCriteriaIdx !== -1
  }

  return {
    entryRootCondition, setEntryRootCondition,
    entryRuleTypeCondition, setEntryRuleTypeCondition,
    entryOptionTypeArray, setEntryOptionTypeArray,
    entryOptionsDataArray, setEntryOptionsDataArray,
    selectedCriteria, setSelectedCriteria,
    addNewCondtion,
    selectedRules,addNewRule,
    deleteRule,
    deleteEntryOptionsDataArray,
    selectEntryOptionsDataArrayForUpdate,
    entryOptionsDataArrayUpdate,
    isCondtionUpdateEnabled,
    updateCondition,
    setSelectedRule,
    updateCriteriaIdx,
    setUpdateCriteriaIdx,
    isUpdateCriteriaEnabled
  }
}