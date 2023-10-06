import React, { useContext, useRef, useState } from 'react';
import { Section, Span } from '../../reusables';
import { MoreDarkIcon } from '../../../icons/MoreDark';
import { ThemeContext } from '../theme/ThemeProvider';
import styled from 'styled-components';
import { device } from '../../../config';
import Dropdown, { DropdownValueType } from '../reusables/DropDown';
import EditSvg from '../../../icons/EditSvg.svg';
import RemoveSvg from '../../../icons/RemoveSvg.svg';
import { ConditionArray, ConditionData, IChatTheme } from '../exportedTypes';
import { useClickAway } from '../../../hooks';

export type CriteraValueType = {
  invertedIcon?: any;
  id: number;
  type?: string;
  title?: string;
  icon?: string;
  function: () => void;
};

interface CriteriaProps {
  conditionData: ConditionArray[];
  moreOptions?: boolean;
}

interface MoreOptionsContainerProps {
  handleMoreOptionsClick: (row: number, col: number) => void;
  setSelectedIndex: any;
  selectedIndex: Array<number> | null;
  row: number;
  col: number;
  dropDownValues: DropdownValueType[];
}

// fix dropdown position mobile view and z index
const MoreOptionsContainer = ({
  handleMoreOptionsClick,
  setSelectedIndex,
  selectedIndex,
  row,
  col,
  dropDownValues,
}: MoreOptionsContainerProps) => {
  const theme = useContext(ThemeContext);
  const dropdownRef = useRef<any>(null);

  useClickAway(dropdownRef, () => setSelectedIndex(null));

  return (
    <Section onClick={() => handleMoreOptionsClick(row, col)}>
      <MoreDarkIcon />
      {selectedIndex?.length && selectedIndex[0] === row && (
        <DropdownContainer
          ref={dropdownRef}
          theme={theme}
        >
          <Dropdown
            dropdownValues={dropDownValues}
            hoverBGColor={theme.backgroundColor?.modalHoverBackground}
          />
        </DropdownContainer>
      )}
    </Section>
  );
};
const CriteriaSection = ({ criteria }: { criteria: ConditionData }) => {
  const theme = useContext(ThemeContext);

  return (
    <Section gap="8px">
      <Span
        alignSelf="center"
        background="#657795"
        borderRadius="4px"
        fontSize="13px"
        color={theme.textColor?.buttonText}
        padding="4px 8px 4px 8px"
      >
        {criteria.category}
      </Span>
      <Span fontWeight="700" color={theme.textColor?.modalHeadingText}>
        {criteria.type}{' '}
        <Span color={theme.textColor?.modalSubHeadingText}>or more</Span>
      </Span>
    </Section>
  );
};
// fix  dropdown ui 
const ConditionsComponent = ({ conditionData, moreOptions = true }: CriteriaProps) => {
  const [selectedIndex, setSelectedIndex] = useState<Array<number> | null>(
    null
  );

  const dropdownRef = useRef<any>(null);

  const dropDownValues: DropdownValueType[] = [
    {
      id: 0,
      value: 'Edit',
      title: 'Edit',
      icon: EditSvg,
      function: () => {
        console.log('function to edit');
      },
    },
    {
      id: 1,
      value: 'Remove',
      title: 'Remove',
      icon: RemoveSvg,
      function: () => {
        console.log('function to remove');
      },
    },
  ];
  const theme = useContext(ThemeContext);

  useClickAway(dropdownRef, () => setSelectedIndex(null));


  //fix the theming

  const handleMoreOptionsClick = (row: number, col: number) => {
    setSelectedIndex([row, col]);
  };
  console.log(conditionData)
  return (
    <Section flexDirection='column'  width='100%'>
      {/* we can reuse the code by creating a reusable component for it */}
      {conditionData &&
        conditionData.slice(1).map((criteria, row) => (
          <Section flexDirection="column" gap="8px" margin='0 0 8px 0' position='relative'>
            {criteria.length === 1 &&
              criteria.map((singleCriteria, col) => (
                <>
                  {singleCriteria.type && (
                    <Section
                      borderRadius="12px"
                      background={theme.backgroundColor?.modalHoverBackground}
                      padding="10px 4px 10px 12px"
                      justifyContent="space-between"
                    >
                      <CriteriaSection criteria={singleCriteria} />
                      {
                        moreOptions && (
                          <MoreOptionsContainer
                            handleMoreOptionsClick={handleMoreOptionsClick}
                            row={row}
                            col={col}
                            dropDownValues={dropDownValues}
                            setSelectedIndex={setSelectedIndex}
                            selectedIndex={selectedIndex}
                          />
                        )
                      }
                    </Section>
                  )}
                </>
              ))}

            {criteria.length > 1 && (
              <Section
                flexDirection="row"
                borderWidth="1px"
                justifyContent="space-between"
                alignItems="center"
                borderColor="#E6E7EE"
                borderRadius="12px"
                borderStyle="solid"
                padding="8px 0px 8px 8px"
                gap="25px"
              >
                <Section flexDirection="column" gap="8px" width="100%">
                  {criteria.map((singleCriteria, col) => (
                    <>
                      {singleCriteria.type && (
                        <>
                          <Section
                            borderRadius="12px"
                            background={
                              theme.backgroundColor?.modalHoverBackground
                            }
                            padding="10px 4px 10px 12px"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <CriteriaSection criteria={singleCriteria} />
                          </Section>
                        </>
                      )}
                    </>
                  ))}
                </Section>
                <Section>
                  {criteria.map((singleCriteria) => (
                    <>
                      {singleCriteria.operator && !singleCriteria.type && (
                        <OperatorSpan theme={theme}>
                          {singleCriteria.operator}
                        </OperatorSpan>
                      )}
                    </>
                  ))}
                  {moreOptions && (
                    <MoreOptionsContainer
                      handleMoreOptionsClick={handleMoreOptionsClick}
                      row={row}
                      col={0}
                      dropDownValues={dropDownValues}
                      setSelectedIndex={setSelectedIndex}
                      selectedIndex={selectedIndex}
                    />
                  )}
                </Section>
              </Section>
            )}
            {conditionData &&
              row < conditionData.length - 2 &&
              conditionData[0][0]?.operator && (
                // this can be reused
                <OperatorSpan theme={theme}>
                  {conditionData[0][0].operator}
                </OperatorSpan>
              )}
          </Section>
        ))}
    </Section>
  );
};

export default ConditionsComponent;

const DropdownContainer = styled.div`
  position: absolute;
  left: 48%;
  top: 69%;
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  padding: 14px 8px;
  z-index: 999999999999 !important;
  display: flex;
  flex-direction: column !important;
  background: ${(props) => props.theme.backgroundColor.modalBackground};
  border: ${(props) => props.theme.border.modalInnerComponents};

  @media ${device.mobileL} {
    left: 27%;
    z-index: 999999999999 !important;
  }
  @media (min-width: 426px) and (max-width: 1150px) {
    left: 48%;
  }
  @media (max-width: 674px) {
    left: 25%;
    margin-left: -130px;
  }
`;

const OperatorSpan = styled.span<{ theme: IChatTheme }>`
  padding: 4px 8px;
  margin: 0 8px 0px 0px;
  border-radius: ${(props) => props.theme.borderRadius.modalInnerComponents};
  background: ${(props) => props.theme.backgroundColor.modalHoverBackground};
  color: ${(props) => props.theme.textColor?.modalSubHeadingText};
`;
