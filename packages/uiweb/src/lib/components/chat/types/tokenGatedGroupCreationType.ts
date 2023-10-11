export interface PushData {
  contract?: string;
  amount?: number;
  decimals?: number;
  inviterRoles?: string[];
  comparison?:string;
  url?: string;
  token?:string;
}

export interface GuildData {
  id: string;
  role: string;
  comparison: string;
}

export type Data = PushData | GuildData;

export interface Rule {
  type: string;
  // category: 'ERC20' | 'ERC721';
  category: string;
  subcategory: string;
  data: Data;
}

export type Condition = Rule | AnyCondition | AllCondition;

export interface AnyCondition {
  any: Condition[];
}

export interface AllCondition {
  all: Condition[];
}

export interface ChatConditions {
  conditions: AllCondition | AnyCondition;
}

export interface TokenGatedRule{
  chat:ChatConditions,
  entry:ChatConditions
}

export type ConditionType = 'any' | 'all';

export interface CriteriaStateType {
  entryRootCondition: ConditionType;
  setEntryRootCondition: React.Dispatch<React.SetStateAction<ConditionType>>;
  entryRuleTypeCondition: ConditionType;
  setEntryRuleTypeCondition: React.Dispatch<
    React.SetStateAction<ConditionType>
  >;
  entryOptionTypeArray: ConditionType[];
  setEntryOptionTypeArray: React.Dispatch<
    React.SetStateAction<ConditionType[]>
  >;
  entryOptionsDataArray: Rule[][];
  setEntryOptionsDataArray: React.Dispatch<React.SetStateAction<Rule[][]>>;
  selectedCriteria: number;
  setSelectedCriteria: React.Dispatch<React.SetStateAction<number>>;
  selectedRules: Rule[];
  setSelectedRule: React.Dispatch<React.SetStateAction<Rule[]>>;
  addNewCondtion: () => void;
  addNewRule: (newRule: Rule) => void;
  deleteRule: (idx: number) => void;
  deleteEntryOptionsDataArray: (idx: number) => void;
  selectEntryOptionsDataArrayForUpdate: (idx: number) => void;
  entryOptionsDataArrayUpdate: number;
  isCondtionUpdateEnabled: () => boolean;
  updateCondition: () => void;
  updateCriteriaIdx: number;
  setUpdateCriteriaIdx: React.Dispatch<React.SetStateAction<number>>;
  isUpdateCriteriaEnabled: () => boolean;
}


export type CriteriaValidationErrorType = {
  //guild error
  guildId?:string,
  guildComparison?:string;
  guildRole?:string;
  groupName?:string;
  groupDescription?:string;

  //token error
  tokenError?:string
}