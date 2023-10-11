import axios from 'axios';
import { CATEGORY, CriteriaStateType, CriteriaValidationErrorType, Data, GuildData, PushData, Rule, TYPE } from '../types';
import { fetchERC20Info, fetchERC721nfo } from './tokenHelpers';
import { ethers } from "ethers";

const handleDefineCondition = (
  entryCriteria: CriteriaStateType,
  handlePrevious: (() => void) | undefined
) => {
  if (entryCriteria.isCondtionUpdateEnabled()) {
    // handle update
    entryCriteria.updateCondition();
  } else {
    // handle insertion
    entryCriteria.addNewCondtion();
  }

  if (handlePrevious) {
    handlePrevious();
  }
};

const validateGUILDData = async (condition: Rule): Promise<CriteriaValidationErrorType> => {
  const { data } = condition;
  let errors: any = {};

  // Check for guild ID presence
  if (!(data as GuildData).id) {
    errors = { ...errors, guildId: 'Guild ID is missing' };
  } else {
    try {
      const response = await axios.get(
        `https://api.guild.xyz/v1/guild/${(data as GuildData).id}`
      );

      if (response.status !== 200) {
        errors = { ...errors, guildId: 'Guild ID is missing' };
      } else {
        // Validate the role values
        if ((data as GuildData).role === '*') {
          if (data.comparison !== 'all' && data.comparison !== 'any') {
            errors = { ...errors, guildComparison: 'Invalid comparison value' };
          }
        } else if ((data as GuildData).role) {
          const roleExists = response.data.roles.some(
            (role: { id: number }) =>
              role.id.toString() === (data as GuildData).role
          );
          if (!roleExists) {
            errors = { ...errors, guildRole: 'Invalid Guild Role ID' };
          }

          // For specific role, comparison can be null or empty
          if (data.comparison) {
            errors = {
              ...errors,
              guildComparison: 'Comparison should be empty for specific role',
            };
          }
        } else {
          errors = { ...errors, guildRole: 'Invalid role value' };
        }
      }
    } catch (error) {
      errors = { ...errors, guildId: 'Error validating Guild ID' };
    }
  }

  return errors;
};

const validateTokenData = async (condition:Rule):Promise<CriteriaValidationErrorType> =>{
  const data:PushData = condition.data;
  const _contract = data.contract || ""
  const _eip155Format = _contract.split(":")

  if(_eip155Format.length !==3){
    return {tokenError:"Invalid contract"}
  }

  const [chainId, address] = [parseInt(_eip155Format[1]), _eip155Format[2]]

  if(!ethers.utils.isAddress(address)){
    return {tokenError:`Invalid contract address`}
  }

  const [err] = condition.category === CATEGORY.ERC721 ? 
    await fetchERC721nfo(address, chainId) : await fetchERC20Info(address, chainId);

  if(err){
   return {tokenError:`Invalid ${condition.category} contract`} 
  }

  return {}  
}

const validationCriteria =  async (condition: Rule):Promise<CriteriaValidationErrorType> => {
 if(condition.type === TYPE.GUILD)
 {
  return validateGUILDData(condition);
 }else{
  // PUSH type
  if(condition.category === CATEGORY.INVITE){
    // validate invite
  }else if (condition.category === CATEGORY.CustomEndpoint){
    // custim role
  }else{
    // token verifcation
    return validateTokenData(condition)
  }
 }

return {};
}
export { handleDefineCondition ,validationCriteria};
