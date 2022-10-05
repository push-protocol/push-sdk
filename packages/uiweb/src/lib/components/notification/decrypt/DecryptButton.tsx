import * as React from "react";
import Loader from "../../loader/loader";
import ActionButton from '.././styled/ActionButton';

export type DecryptButtonProps = {
  decryptFn: () => Promise<unknown>;
  isSecretRevealed: boolean
};

const buttonText = {
  revealed: 'decrypted',
  notRevealed: 'decrypt'
}

const DecryptButton: React.FC<DecryptButtonProps> = ({
  decryptFn,
  isSecretRevealed
}) => {
    const [isLoading, setIsLaoding] = React.useState(false);
    const btnText = isSecretRevealed ? buttonText.revealed : buttonText.notRevealed;

    const onClickHandler = async (clickEvent: React.SyntheticEvent<HTMLElement>) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
    
        if (!decryptFn || isSecretRevealed) return;

        try {
            setIsLaoding(true);
            await decryptFn();
        } finally { 
            setIsLaoding(false);
        }
      };

    return (
        <ActionButton disabled={isSecretRevealed} onClick={onClickHandler} bgColor="#674C9F">
          {isLoading ? <Loader /> : btnText}
        </ActionButton>
    );
};

export default DecryptButton;