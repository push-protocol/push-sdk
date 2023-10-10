import axios from 'axios';
import { CriteriaStateType, Data, GuildData, Rule } from '../types';

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

const validateGUILDData = async (condition: Rule): Promise<string[]> => {
  const { data } = condition;
  const errors: string[] = [];

  // Check for guild ID presence
  if (!(data as GuildData).id) {
    errors.push('Guild ID is missing');
  } else {
    try {
      const response = await axios.get(
        `https://api.guild.xyz/v1/guild/${(data as GuildData).id}`
      );

      if (response.status !== 200) {
        errors.push('Invalid Guild ID');
      } else {
        // Validate the role values
        if ((data as GuildData).role === '*') {
          if (data.comparison !== 'all' && data.comparison !== 'any') {
            errors.push('Invalid comparison value');
          }
        } else if ((data as GuildData).role) {
          const roleExists = response.data.roles.some(
            (role: { id: number }) =>
              role.id.toString() === (data as GuildData).role
          );
          if (!roleExists) {
            errors.push('Invalid Guild Role ID');
          }

          // For specific role, comparison can be null or empty
          if (data.comparison) {
            errors.push('Comparison should be empty for specific role');
          }
        } else {
          errors.push('Invalid role value');
        }
      }
    } catch (error) {
      errors.push('Error validating Guild ID');
    }
  }

  return errors;
};

export { handleDefineCondition, validateGUILDData };
