import React, { useContext } from 'react'
import { Button } from '../reusables'
import { ThemeContext } from '../theme/ThemeProvider';

interface AddButtonsProps {
    title: string;
    handleNext?: () => void;
}

export const AddButtons = ({title, handleNext}: AddButtonsProps) => {
  const theme = useContext(ThemeContext);
  return (
    <Button
        customStyle={{
          color: `${theme.backgroundColor?.buttonBackground}`,
          fontSize: '15px',
          fontWeight: '500',
          border: `${theme.border?.modalInnerComponents}`,
          background: 'transparent',
        }}
        onClick={handleNext}
      >
        {title}
      </Button>
  )
}
