import { useState } from 'react';
import {
  Condition,
  ConditionType,
  CriteriaStateType,
  Rule,
  TokenGatedRule,
} from '../../components/chat/types';
import { OPERATOR_OPTIONS } from '../../components/chat/constants';

export const useCriteriaState = (defaultRules: Rule[][]): CriteriaStateType => {
  const [entryRootCondition, setEntryRootCondition] =
    useState<ConditionType>(OPERATOR_OPTIONS[1]?.value as ConditionType);
  const [entryRuleTypeCondition, setEntryRuleTypeCondition] =
    useState<ConditionType>(OPERATOR_OPTIONS[1]?.value as ConditionType);
  const [entryOptionTypeArray, setEntryOptionTypeArray] = useState<
    ConditionType[]
  >([]);
  const [entryOptionsDataArray, setEntryOptionsDataArray] =
    useState<Rule[][]>(defaultRules);

  const [selectedCriteria, setSelectedCriteria] = useState(-1);
  const [selectedRules, setSelectedRule] = useState<Rule[]>([]);

  const [entryOptionsDataArrayUpdate, setEntryOptionsDataArrayUpdate] =
    useState(-1);
  const [updateCriteriaIdx, setUpdateCriteriaIdx] = useState(-1);

  const addNewRule = (newRule: Rule) => {
    if (selectedCriteria === -1) {
      setSelectedCriteria(entryOptionTypeArray.length);
    }

    if (updateCriteriaIdx !== -1) {
      // update existing
      const _rulesToUpdate = [...selectedRules];
      _rulesToUpdate[updateCriteriaIdx] = newRule;
      setSelectedRule(_rulesToUpdate);
    } else {
      // add new
      setSelectedRule((prev) => [...prev, newRule]);
    }
  };

  const deleteRule = (idx: number) => {
    const removedRule = [...selectedRules];
    removedRule.splice(idx, 1);
    setSelectedRule(removedRule);
  };

  const addNewCondtion = () => {
    if (selectedRules.length > 0) {
      setEntryOptionTypeArray((prev) => [...prev, entryRuleTypeCondition]);
      setEntryOptionsDataArray((prev) => [...prev, [...selectedRules]]);
    }
    setSelectedRule([]);
  };

  const updateCondition = () => {
    const optionTypeArrayUpdated = [...entryOptionTypeArray];
    optionTypeArrayUpdated[entryOptionsDataArrayUpdate] =
      entryRuleTypeCondition;

    const entryOptionsDataArrayUpdated = [...entryOptionsDataArray];
    entryOptionsDataArrayUpdated[entryOptionsDataArrayUpdate] = [
      ...selectedRules,
    ];

    setEntryOptionTypeArray(optionTypeArrayUpdated);
    setEntryOptionsDataArray(entryOptionsDataArrayUpdated);

    setSelectedRule([]);
  };

  const isCondtionUpdateEnabled = () => {
    return entryOptionsDataArrayUpdate !== -1;
  };

  const deleteEntryOptionsDataArray = (idx: number) => {
    const removedRule = [...entryOptionsDataArray];
    removedRule.splice(idx, 1);
    setEntryOptionsDataArray(removedRule);
  };

  const selectEntryOptionsDataArrayForUpdate = (idx: number) => {
    setEntryOptionsDataArrayUpdate(idx);
  };

  const isUpdateCriteriaEnabled = () => {
    return updateCriteriaIdx !== -1;
  };

  return {
    entryRootCondition,
    setEntryRootCondition,
    entryRuleTypeCondition,
    setEntryRuleTypeCondition,
    entryOptionTypeArray,
    setEntryOptionTypeArray,
    entryOptionsDataArray,
    setEntryOptionsDataArray,
    selectedCriteria,
    setSelectedCriteria,
    addNewCondtion,
    selectedRules,
    addNewRule,
    deleteRule,
    deleteEntryOptionsDataArray,
    selectEntryOptionsDataArrayForUpdate,
    entryOptionsDataArrayUpdate,
    isCondtionUpdateEnabled,
    updateCondition,
    setSelectedRule,
    updateCriteriaIdx,
    setUpdateCriteriaIdx,
    isUpdateCriteriaEnabled,
  };
};

export enum SelectedCriteria {
  ENTRY,
  CHAT,
}

export interface CriteriaStateManagerType {
  entryCriteria: CriteriaStateType;
  chatCriteria: CriteriaStateType;
  seletedCriteria: SelectedCriteria;
  setSelectedCriteria: React.Dispatch<React.SetStateAction<SelectedCriteria>>;
  getSelectedCriteria: () => CriteriaStateType;
  resetRules: () => void;
  resetCriteriaIdx: () => void;
  generateRule: () => TokenGatedRule;
}

export const useCriteriaStateManager = (): CriteriaStateManagerType => {
  const [seletedCriteria, setSelectedCriteria] = useState<SelectedCriteria>(
    SelectedCriteria.CHAT
  );
  const entryCriteria = useCriteriaState([
    [
      {
        type: 'PUSH',
        category: 'INVITE',
        subcategory: 'DEFAULT',
        data: {
          inviterRoles: ['ADMIN', 'OWNER'],
        },
      },
    ],
  ]);
  const chatCriteria = useCriteriaState([]);

  const getSelectedCriteria = () => {
    if (seletedCriteria === SelectedCriteria.CHAT) {
      return chatCriteria;
    } else {
      return entryCriteria;
    }
  };

  const resetRules = () => {
    entryCriteria.selectEntryOptionsDataArrayForUpdate(-1);
    entryCriteria.setSelectedRule([]);
    chatCriteria.selectEntryOptionsDataArrayForUpdate(-1);
    chatCriteria.setSelectedRule([]);
  };

  const resetCriteriaIdx = () => {
    entryCriteria.setUpdateCriteriaIdx(-1);
    chatCriteria.setUpdateCriteriaIdx(-1);
  };

  const _generate = (rules: Rule[][], conditionTypes: ConditionType[]):Condition[] => {
    return conditionTypes.map((el, idx) => ({
      [el]: rules[idx].map((_el) => _el),
    })) as any;
  };

  const generateRule = ():TokenGatedRule => {
    return {
      entry:{
        conditions: {
          [chatCriteria.entryRootCondition]: _generate(
            chatCriteria.entryOptionsDataArray,
            chatCriteria.entryOptionTypeArray
          ),
        },
      },
      chat: {
        conditions: {
          [entryCriteria.entryRootCondition]: _generate(
            entryCriteria.entryOptionsDataArray,
            entryCriteria.entryOptionTypeArray
          ),
        },
      },
    } as any;
  };

  return {
    entryCriteria,
    chatCriteria,
    seletedCriteria,
    setSelectedCriteria,
    getSelectedCriteria,
    resetRules,
    resetCriteriaIdx,
    generateRule
  };
};
