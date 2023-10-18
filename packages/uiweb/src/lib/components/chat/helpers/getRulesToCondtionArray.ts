import { ConditionArray } from '../exportedTypes';
import * as PushAPI from '@pushprotocol/restapi';
import { fetchERC20Info, fetchERC721nfo } from './tokenHelpers';

export interface GroupRulesType {
  CHAT: ConditionArray[];
  ENTRY: ConditionArray[];
}

export const getRuleInfo = (
  rules: PushAPI.Rules | null | undefined
): GroupRulesType => {
  if (!rules) {
    return {
      CHAT: [],
      ENTRY: [],
    };
  }

  const [chatRules, entryRules] = [
    getRulesToCondtionArray(rules.entry),
    getRulesToCondtionArray(rules.chat),
  ];

  return {
    CHAT: chatRules,
    ENTRY: entryRules,
  };
};

const getRulesToCondtionArray = (arr: any) => {
  const getKey = (_json: any) => {
    return Object.keys(_json)[0];
  };

  if (!arr) {
    return [];
  }

  const data = [];
  const conditions = Array.isArray(arr.conditions)
    ? arr.conditions[0]
    : arr.conditions;
  const rootOperator = getKey(conditions);

  data.push([{ operator: rootOperator }]);

  if (conditions[rootOperator].length === 0) {
    return [];
  }

  const rules = conditions[rootOperator];

  for (const rule of rules) {
    const nodeOperator = getKey(rule);
    if (nodeOperator === 'type') {
      data.push([rule]);
    } else {
      data.push([
        { operator: nodeOperator },
        ...rule[nodeOperator].map((el: any) => ({ ...el })),
      ]);
    }
  }

  return data as ConditionArray[];
};