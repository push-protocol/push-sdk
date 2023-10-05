import { CriteriaStateType, Data } from '../CreateGroup/Type';
import { DropdownValueType } from '../reusables';
import { CATEGORY, DropdownCategoryValuesType } from '../types';

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




export {handleDefineCondition}
