import axios from 'axios';
import { CriteriaStateType, CriteriaValidationErrorType, Data, GuildData, Rule, TYPE } from '../types';

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

const validationCriteria =  async (condition: Rule):Promise<CriteriaValidationErrorType> => {
 if(condition.type === TYPE.GUILD)
 {
  return validateGUILDData(condition);
 }

return {};
}
export { handleDefineCondition ,validationCriteria};
