import { useContext } from 'react';
import { Section, Span } from '../../reusables';
import { OPERATOR_OPTIONS, OPERATOR_OPTIONS_INFO } from '../constants';
import { OptionButtons } from '../reusables';
import { ThemeContext } from '../theme/ThemeProvider';

interface OperatorContainerProps {
  operator: string;
  setOperator: any;
}
export const OperatorContainer = ({
  operator,
  setOperator,
}: OperatorContainerProps) => {
  const theme = useContext(ThemeContext);

  return (
    <Section flexDirection="column" gap="16px">
      <OptionButtons
        options={OPERATOR_OPTIONS}
        selectedValue={operator}
        handleClick={(newEl: string) => {
          setOperator(newEl);
        }}
      />
      <Span fontSize="14px">
        {
          OPERATOR_OPTIONS_INFO[
            operator as keyof typeof OPERATOR_OPTIONS_INFO
          ]?.head
        }
        <Span color={theme.textColor?.modalSubHeadingText}>
          {' '}
          {
            OPERATOR_OPTIONS_INFO[
              operator as keyof typeof OPERATOR_OPTIONS_INFO
            ]?.tail
          }
        </Span>
      </Span>
    </Section>
  );
};
