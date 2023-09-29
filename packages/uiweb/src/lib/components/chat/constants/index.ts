import { OptionDescription } from "../reusables";

export const INVITE_CHECKBOX_LABEL: { owner: string; admin: string } = {
    owner: 'Only Owner can invite',
    admin: 'Only Admin can invite',
  };
  
 export  const GUILD_COMPARISON_OPTIONS: Array<OptionDescription> = [
    {
      heading: 'ALL',
      value: 'all',
    },
    {
      heading: 'ALL',
      value: 'any',
    },
    {
      heading: 'SPECIFIC',
      value: 'specific',
    },
  ];