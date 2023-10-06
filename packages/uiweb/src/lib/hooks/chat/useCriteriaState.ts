import { useState } from 'react';
import {
  ConditionType,
  CriteriaStateType,
  Rule,
} from '../../components/chat/types';

export const useCriteriaState = (): CriteriaStateType => {
  const [entryRootCondition, setEntryRootCondition] =
    useState<ConditionType>('all');
  const [entryRuleTypeCondition, setEntryRuleTypeCondition] =
    useState<ConditionType>('all');
  const [entryOptionTypeArray, setEntryOptionTypeArray] = useState<
    ConditionType[]
  >([]);
  const [entryOptionsDataArray, setEntryOptionsDataArray] = useState<Rule[][]>([
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
    if(selectedRules.length > 0){
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
