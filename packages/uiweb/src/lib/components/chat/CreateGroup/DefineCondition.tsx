import { Section, Span } from "../../reusables";
import { Button, ModalHeader } from "../reusables";
import { AddButtons } from "./AddButtons";
import { ModalHeaderProps } from "./CreateGroupModal";
import { useContext, useState } from "react";
import { ThemeContext } from "../theme/ThemeProvider";
import { GatingRulesInformation } from "./CreateGroupModal";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { device } from "../../../config";


export const DefineCondtion = ({ onClose, handlePrevious, handleNext }: ModalHeaderProps) => {
    const theme = useContext(ThemeContext);
    const [disableButton, setDisableButton] = useState<boolean>(true);
    const customButtonStyle = {
        background: disableButton ? theme.backgroundColor?.buttonDisableBackground : theme.backgroundColor?.buttonBackground,
        color: disableButton ? theme.textColor?.buttonDisableText : theme.textColor?.buttonText,
    };
    const isMobile = useMediaQuery(device.mobileL);
    return (
        <Section flexDirection="column" gap="20px" width={isMobile?'300px':'400px'}>
            <ModalHeader title='Define Condition' handleClose={onClose} handlePrevious={handlePrevious} />
            <Section flexDirection="column" gap="10px">
                <AddButtons handleNext={handleNext} title={'+ Add criteria'} />
                <Span fontSize="15px" fontWeight="400" color={theme.textColor?.modalSubHeadingText}>You must add at least 1 criteria to enable gating</Span>
            </Section>
            <Button customStyle={customButtonStyle} width="158px">Add</Button>
            <GatingRulesInformation />
        </Section>
    )
}
