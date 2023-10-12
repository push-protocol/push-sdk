import axios from 'axios';
import {
  CATEGORY,
  CriteriaStateType,
  CriteriaValidationErrorType,
  Data,
  GuildData,
  PushData,
  Rule,
  TYPE,
} from '../types';

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

const validateCustomEndpointData = async (
  condition: Rule
): Promise<CriteriaValidationErrorType> => {
  const { data, type, subcategory } = condition;
  let errors: CriteriaValidationErrorType = {};

  if (!(data as PushData).url) {
    return { url: 'URL is missing' };
  } else {
    // Protocol Validation
    if (
      !(data as PushData)?.url!.startsWith('http://') &&
      !(data as PushData).url!.startsWith('https://')
    ) {
      return {
        url: 'Invalid URL protocol. Only "http://" and "https://" are allowed.',
      };
    }
    // URL Length Check
    if ((data as PushData)?.url!.length > 2083) {
      return { url: 'URL is too long.' };
    }

    // Check for GET and Template
    if (subcategory === 'GET') {
      if (!(data as PushData)?.url!.includes('{{user_address}}')) {
        return {
          url: `GET request URL should have the '{{user_address}}' template.`,
        };
      }

      // Ensure proper number of expected templates
      const matches = (data as PushData)?.url!.match(/{{user_address}}/g) || [];
      if (matches.length > 1) {
        return {
          url: `GET request URL should not have multiple '{{user_address}}' templates.`,
        };
      }
    }
  }
  return {};
};

const validateGUILDData = async (
  condition: Rule
): Promise<CriteriaValidationErrorType> => {
  const { data } = condition;
  let errors: CriteriaValidationErrorType = {};

  // Check for guild ID presence
  if (!(data as GuildData).id) {
    return { ...errors, guildId: 'Guild ID is missing' };
  } else {
    try {
      const response = await axios.get(
        `https://api.guild.xyz/v1/guild/${(data as GuildData).id}`
      );

      if (response.status !== 200) {
        return { ...errors, guildId: 'Guild ID is missing' };
      } else {
        // Validate the role values
        if ((data as GuildData).role === '*') {
          if (data.comparison !== 'all' && data.comparison !== 'any') {
            return { ...errors, guildComparison: 'Invalid comparison value' };
          }
        } else if ((data as GuildData).role) {
          const roleExists = response.data.roles.some(
            (role: { id: number }) =>
              role.id.toString() === (data as GuildData).role
          );
          if (!roleExists) {
            return { ...errors, guildRole: 'Invalid Guild Role ID' };
          }

          // For specific role, comparison can be null or empty
          if (data.comparison) {
            return {
              ...errors,
              guildComparison: 'Comparison should be empty for specific role',
            };
          }
        } else {
          return { ...errors, guildRole: 'Invalid role value' };
        }
      }
    } catch (error) {
      return { ...errors, guildId: 'Error validating Guild ID' };
    }
  }

  return {};
};

const validationCriteria = async (
  condition: Rule
): Promise<CriteriaValidationErrorType> => {
  if (condition.type === TYPE.GUILD) {
    return validateGUILDData(condition);
  }
  if (condition.category === CATEGORY.CustomEndpoint)
    return validateCustomEndpointData(condition);

  return {};
};
export {
  handleDefineCondition,
  validationCriteria,
  validateCustomEndpointData,
};
