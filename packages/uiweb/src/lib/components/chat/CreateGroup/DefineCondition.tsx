import { Section, Span } from "../../reusables";
import { Button, ModalHeader } from "../reusables";
import { AddButtons } from "./AddButtons";
import { ModalHeaderProps } from "./CreateGroupModal";
import { useContext, useState } from "react";
import { ThemeContext } from "../theme/ThemeProvider";
import { GatingRulesInformation } from "./CreateGroupModal";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { device } from "../../../config";
import OptionButtons from "../reusables/OptionButtons";
import Criteria from "./Criteria";
import { OPERATOR_OPTIONS } from "../constants";


export const DefineCondtion = ({ onClose, handlePrevious, handleNext }: ModalHeaderProps) => {
    const [criteriaOperator, setCriteriaOperator] = useState<string>('');
  //todo remove dummy data after we have condition data
    const criteriaOptions = [
        {
            id: 0,
            type: 'Token',
            value: '1.0 ETH',
            title: 'Token',
            function: () => console.log("Token")
        },
        // {
        //     id: 1,
        //     type: 'Token',
        //     value: '1.0 ETH',
        //     title: 'Token',
        //     function: () => console.log("NFT")
        // }
    ]

    const theme = useContext(ThemeContext);
    const [disableButton, setDisableButton] = useState<boolean>(true);
    const customButtonStyle = {
        background: disableButton ? theme.backgroundColor?.buttonDisableBackground : theme.backgroundColor?.buttonBackground,
        color: disableButton ? theme.textColor?.buttonDisableText : theme.textColor?.buttonText,
    };
    const [isCriteriaAdded, setIsCriteriaAdded] = useState<boolean>(true);
    const isMobile = useMediaQuery(device.mobileL);
    return (
        <Section flexDirection="column" gap="20px" width={isMobile?'300px':'400px'}>
            <ModalHeader title='Define Condition' handleClose={onClose} handlePrevious={handlePrevious} />
            {isCriteriaAdded && (
                <Section flexDirection="column" gap="16px">
                    <OptionButtons options={OPERATOR_OPTIONS}  selectedValue={criteriaOperator} handleClick={(newEl:string)=>{
              setCriteriaOperator(newEl)}}/>
                    <Span fontSize="14px">Any one<Span color={theme.textColor?.modalSubHeadingText}> of the following criteria must be true</Span></Span>
                    <Section>
                        <Criteria width="385px" dropdownValues={criteriaOptions}/>
                        </Section>
                </Section>
            )}
            <Section flexDirection="column" gap="10px">
                <AddButtons handleNext={handleNext} title={'+ Add criteria'} />
                <Span fontSize="15px" fontWeight="400" color={theme.textColor?.modalSubHeadingText}>You must add at least 1 criteria to enable gating</Span>
            </Section>
            <Button customStyle={customButtonStyle} width="158px">Add</Button>
            <GatingRulesInformation />
        </Section>
    )
}
