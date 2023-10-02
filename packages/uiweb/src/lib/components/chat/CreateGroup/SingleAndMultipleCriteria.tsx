import Criteria, { CriteraValueType } from "./Criteria"
import MultipleCriterias from "./MultipleCriterias"
import { ConditionType } from "./Type"

export const SingleAndMultipleCriteria = ({dropdownValues,conditionType}:{dropdownValues:CriteraValueType[],conditionType:ConditionType}) =>{
    if(dropdownValues.length > 1){
        return <MultipleCriterias dropdownValues={dropdownValues} conditionType={conditionType}/>
    }
    return <Criteria width="385px" dropdownValues={dropdownValues} conditionType={conditionType}/>
}