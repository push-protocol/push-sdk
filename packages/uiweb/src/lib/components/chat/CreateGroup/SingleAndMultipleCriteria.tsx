import Criteria, { CriteraValueType } from "./Criteria"
import MultipleCriterias from "./MultipleCriterias"

export const SingleAndMultipleCriteria = ({dropdownValues}:{dropdownValues:CriteraValueType[]}) =>{
    if(dropdownValues.length > 1){
        return <MultipleCriterias dropdownValues={dropdownValues} />
    }
    return <Criteria width="385px" dropdownValues={dropdownValues} />
}