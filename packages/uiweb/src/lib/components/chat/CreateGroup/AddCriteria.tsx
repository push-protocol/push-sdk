import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';
import { MdError } from 'react-icons/md';

import {
  Button,
  DropDownInput,
  DropdownValueType,
  ModalHeader,
  TextInput,
} from '../reusables';
import { Section, Span, Spinner } from '../../reusables';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { GatingRulesInformation, ModalHeaderProps } from './CreateGroupModal';
import { useChatData } from '../../../hooks';
import { QuantityInput } from '../reusables/QuantityInput';
import { ThemeContext } from '../theme/ThemeProvider';
import { Checkbox } from '../reusables/Checkbox';
import OptionButtons from '../reusables/OptionButtons';

import EthereumSvg from '../../../icons/ethereum.svg';
import PolygonSvg from '../../../icons/polygon.svg';
import BSCSvg from '../../../icons/bsc.svg';
import OptimismSvg from '../../../icons/optimisim.svg';
import { BLOCKCHAIN_NETWORK, device } from '../../../config';
import { GUILD_COMPARISON_OPTIONS, INVITE_CHECKBOX_LABEL } from '../constants';
import {
  CATEGORY,
  DropdownCategoryValuesType,
  DropdownSubCategoryValuesType,
  SUBCATEGORY,
  TYPE,
  SubCategoryKeys,
  TypeKeys,
  ReadonlyInputType,
} from '../types';
import useToast from '../reusables/NewToast';
import { tokenFetchHandler } from '../helpers/tokenHelpers';
import {
  CriteriaValidationErrorType,
  Data,
  GuildData,
  PushData,
  Rule,
} from '../types/tokenGatedGroupCreationType';
import { validationCriteria } from '../helpers';


const AddCriteria = ({
  handlePrevious,
  handleNext,
  onClose,
  criteriaStateManager,
}: ModalHeaderProps) => {
  const [selectedTypeValue, setSelectedTypeValue] = useState<number>(0);
  const [validationErrors, setValidationErrors] =
    useState<CriteriaValidationErrorType>({});
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<number>(0);
  const [selectedSubCategoryValue, setSelectedSubCategoryValue] =
    useState<number>(0);
  const [validationLoading, setValidationLoading] = useState<boolean>(false);
  const [guildComparison, setGuildComparison] = useState('');
  const [selectedChainValue, setSelectedChainValue] = useState<number>(0);
  const [contract, setContract] = useState<string>('');
  const [inviteCheckboxes, setInviteCheckboxes] = useState<{
    admin: boolean;
    owner: boolean;
  }>({ admin: true, owner: true });
  const [url, setUrl] = useState<string>('');
  const [guildId, setGuildId] = useState<string>('');
  const [specificRoleId, setSpecificRoleId] = useState<string>('');
  const [unit, setUnit] = useState('TOKEN');
  const [decimals, setDecimals] = useState(18);

  const [quantity, setQuantity] = useState<{ value: number; range: number }>({
    value: 0,
    range: 0,
  });
  const { env } = useChatData();
  const theme = useContext(ThemeContext);
  const groupInfoToast = useToast();

  const isMobile = useMediaQuery(device.mobileL);

  const dropdownQuantityRangeValues: Array<DropdownValueType> = [
    {
      id: 0,
      title: 'Greater than',
      value: '>',
      function: () => setQuantity({ ...quantity, range: 0 }),
    },
    {
      id: 1,
      title: 'Greater or equal to',
      value: '>=',
      function: () => setQuantity({ ...quantity, range: 1 }),
    },
    {
      id: 2,
      title: 'Less than',
      value: '<',
      function: () => setQuantity({ ...quantity, range: 2 }),
    },
    {
      id: 3,
      title: 'Less or equal to',
      value: '<=',
      function: () => setQuantity({ ...quantity, range: 3 }),
    },
    {
      id: 4,
      title: 'Equal to',
      value: '==',
      function: () => setQuantity({ ...quantity, range: 4 }),
    },
    {
      id: 5,
      title: 'Not equal to',
      value: '!=',
      function: () => setQuantity({ ...quantity, range: 5 }),
    },
  ];
  const dropdownTypeValues: Array<DropdownValueType> = [
    {
      id: 0,
      title: 'Push protocol',
      value: TYPE.PUSH,
      function: () => setSelectedTypeValue(0),
    },
    {
      id: 1,
      title: 'Guild',
      value: TYPE.GUILD,
      function: () => setSelectedTypeValue(1),
    },
  ];
  const dropdownCategoryValues: DropdownCategoryValuesType = {
    PUSH: [
      {
        id: 0,
        value: CATEGORY.ERC20,
        title: 'Token ERC20',
        function: () => setSelectedCategoryValue(0),
      },
      {
        id: 1,
        value: CATEGORY.ERC721,
        title: 'NFT ERC721',
        function: () => setSelectedCategoryValue(1),
      },
      {
        id: 2,
        value: CATEGORY.INVITE,
        title: 'Invite',
        function: () => setSelectedCategoryValue(2),
      },
      {
        id: 3,
        value: CATEGORY.CustomEndpoint,
        title: 'Custom Endpoint',
        function: () => setSelectedCategoryValue(3),
      },
    ],
    GUILD: {
      value: CATEGORY.ROLES,
      title: 'Roles',
    },
  };

  const dropdownSubCategoryValues: DropdownSubCategoryValuesType = {
    ERC20: {
      value: SUBCATEGORY.HOLDER,
      title: 'Holder',
    },
    ERC721:{
      value: SUBCATEGORY.HOLDER,
      title: 'Holder',
    },
    INVITE: {
      value: SUBCATEGORY.DEFAULT,
      title: 'Default',
    },
    CustomEndpoint: [
      {
        id: 0,
        value: SUBCATEGORY.GET,
        title: 'Get',
        function: () => setSelectedSubCategoryValue(0),
      },
    ],
    ROLES: {
      value: SUBCATEGORY.DEFAULT,
      title: 'Default',
    },
  };

  const dropdownChainsValues: Array<DropdownValueType> = [
    {
      id: 0,
      value: BLOCKCHAIN_NETWORK[env].ETHEREUM,
      title: 'Ethereum',
      icon: EthereumSvg,
      function: () => setSelectedChainValue(0),
    },
    {
      id: 1,
      value: BLOCKCHAIN_NETWORK[env].POLYGON,
      title: 'Polygon',
      icon: PolygonSvg,
      function: () => setSelectedChainValue(1),
    },
    {
      id: 2,
      value: BLOCKCHAIN_NETWORK[env].BSC,
      title: 'BSC',
      icon: BSCSvg,
      function: () => setSelectedChainValue(2),
    },
    {
      id: 3,
      value: BLOCKCHAIN_NETWORK[env].OPTIMISM,
      title: 'Optimism',
      icon: OptimismSvg,
      function: () => setSelectedChainValue(3),
    },
  ];

  const getCategoryDropdownValues = () => {
    return dropdownCategoryValues[
      dropdownTypeValues[selectedTypeValue].value as TypeKeys
    ];
  };

  const getSelectedCategoryValue = () => {
    const category = getCategoryDropdownValues();
    if (Array.isArray(category))
      return (category as DropdownValueType[])[selectedCategoryValue].value!;
    else return category.value! as SubCategoryKeys;
  };

  const getSelectedSubCategoryValue = () => {
    const subCategory = getSubCategoryDropdownValues();
    if (Array.isArray(subCategory))
      return (subCategory as DropdownValueType[])[selectedCategoryValue].value!;
    else return subCategory.value! as SubCategoryKeys;
  };

  const checkIfTokenNFT = () => {
    const category = getSelectedCategoryValue();
    if (category === CATEGORY.ERC20 || category === CATEGORY.ERC721)
      return true;

    return false;
  };

  const checkIfCustomEndpoint = () => {
    const category = getSelectedCategoryValue();
    if (category === CATEGORY.CustomEndpoint) return true;
    return false;
  };

  const checkIfPushInvite = () => {
    const accessType = dropdownTypeValues[selectedTypeValue].value;
    if (accessType === TYPE.PUSH) {
      const category = getSelectedCategoryValue();
      if (category === CATEGORY.INVITE) return true;
    }

    return false;
  };

  const checkIfGuild = () => {
    const accessType = dropdownTypeValues[selectedTypeValue].value;
    if (accessType === TYPE.GUILD) {
      return true;
    }

    return false;
  };

  const getSubCategoryDropdownValues = () => {
    const category = getCategoryDropdownValues();
    if (Array.isArray(category))
      return dropdownSubCategoryValues[
        (category as DropdownValueType[])[selectedCategoryValue]
          .value as SubCategoryKeys
      ];
    else return dropdownSubCategoryValues[category.value as SubCategoryKeys];
  };

  const onQuantityChange = (e: any) => {
    setQuantity({ ...quantity, value: e.target.value });
  };

  const verifyAndDoNext = async () => {
    setValidationLoading(true);
    const _type = dropdownTypeValues[selectedTypeValue].value as
      | 'PUSH'
      | 'GUILD';
    const category: string =
      _type === 'PUSH'
        ? (dropdownCategoryValues[_type] as DropdownValueType[])[
            selectedCategoryValue
          ].value || CATEGORY.ERC20
        : 'ROLES';

    let subCategory = 'DEFAULT';
    if (_type === 'PUSH') {
      if (category === CATEGORY.ERC20 || category === CATEGORY.ERC721) {
        subCategory = SUBCATEGORY.HOLDER
      } else if (category === CATEGORY.CustomEndpoint) {
        subCategory = 'GET';
      }
    }

    const getData = (type: string, category: string): Data => {
      if (type === 'PUSH') {
        if (category === CATEGORY.ERC20 || category === CATEGORY.ERC721) {
          const selectedChain =
            dropdownChainsValues[selectedChainValue].value || 'eip155:1';
          return {
            contract: `${selectedChain}:${contract}`,
            amount: quantity.value,
            comparison: dropdownQuantityRangeValues[quantity.range].value,
            decimals: category === CATEGORY.ERC20 ? decimals : undefined,
            token: unit,
          };
        } else if (category === CATEGORY.INVITE) {
          const _inviteRoles = [];
          if (inviteCheckboxes.admin) {
            _inviteRoles.push('ADMIN');
          }
          if (inviteCheckboxes.owner) {
            _inviteRoles.push('OWNER');
          }

          return {
            inviterRoles: _inviteRoles as ['OWNER' | 'ADMIN'],
          };
        } else {
          return {
            url: url,
          };
        }
      } else {
        return {
          id: guildId,
          comparison: guildComparison === 'specific' ? '' : guildComparison,
          role: guildComparison === 'specific' ? specificRoleId : '*',
        };
      }
    };

    const rule: Rule = {
      type: _type,
      category: category,
      subcategory: subCategory,
      data: getData(_type, category),
    };

    //guild validation added
    const errors = await validationCriteria(rule);
    setValidationLoading(false);
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
    } else {
      const isSuccess = criteriaState.addNewRule(rule);
      if (!isSuccess) {
        showError('Selected Criteria was already added');
        return;
      }
      if (handlePrevious) {
        handlePrevious();
      }
    }
  };

  const criteriaState = criteriaStateManager.getSelectedCriteria();

  // Autofill the form for the update
  useEffect(() => {
    if (criteriaState.isUpdateCriteriaEnabled()) {
      //Load the states
      const oldValue =
        criteriaState.selectedRules[criteriaState.updateCriteriaIdx];

      if (oldValue.type === 'PUSH') {
        // category
        setSelectedCategoryValue(
          (dropdownCategoryValues.PUSH as DropdownValueType[]).findIndex(
            (obj) => obj.value === oldValue.category
          )
        );

        const pushData = oldValue.data as PushData;

        // sub category
        if (
          oldValue.category === CATEGORY.ERC20 ||
          oldValue.category === CATEGORY.ERC721
        ) {
          
          if(pushData.token){
            setUnit(pushData.token)
          }

          if (pushData.decimals) {
            setDecimals(decimals);
          }

          // TODO: make helper function for this
          const contractAndChain: string[] = (
            pushData.contract || 'eip155:1:0x'
          ).split(':');
          setSelectedChainValue(
            dropdownChainsValues.findIndex(
              (obj) =>
                obj.value === contractAndChain[0] + ':' + contractAndChain[1]
            )
          );
          setContract(contractAndChain.length === 3 ? contractAndChain[2] : '');
          setQuantity({
            value: pushData.amount || 0,
            range: dropdownQuantityRangeValues.findIndex(
              (obj) => obj.value === pushData.comparison
            ),
          });
        } else if (oldValue.category === CATEGORY.INVITE) {
          setInviteCheckboxes({
            admin: true,
            owner: true,
          });
        } else {
          // invite
          setUrl(pushData.url || '');
        }
      } else {
        // guild condition
        setGuildId((oldValue.data as GuildData).id);
        setSpecificRoleId((oldValue.data as GuildData).role);
        setGuildComparison(((oldValue.data as GuildData).comparison) || GUILD_COMPARISON_OPTIONS[2].value);
      }

      setSelectedTypeValue(
        dropdownTypeValues.findIndex((obj) => obj.value === oldValue.type)
      );
    }
  }, []);

  const getSeletedType = () => {
    return dropdownTypeValues[selectedTypeValue].value || 'PUSH';
  };

  const getSelectedCategory = () => {
    const category: string =
      (dropdownCategoryValues['PUSH'] as DropdownValueType[])[
        selectedCategoryValue
      ].value || CATEGORY.ERC20;

    return category;
  };

  const getSelectedChain = () => {
    return dropdownChainsValues[selectedChainValue].value || 'eip155:1';
  };

  // Fetch the contract info
  useEffect(() => {
    // TODO: optimize to reduce this call call when user is typing
    (async()=>{
      setValidationErrors(prev => ({...prev, tokenError:undefined})) 

      const _type = getSeletedType();
      const _category: string = getSelectedCategory();
      const _chainInfo = getSelectedChain();

      await tokenFetchHandler(
        contract,
        _type,
        _category,
        _chainInfo,
        setUnit,
        setDecimals
      );
    })();
  }, [contract, selectedCategoryValue, selectedChainValue]);

  const showError = (errorMessage: string) => {
    groupInfoToast.showMessageToast({
      toastTitle: 'Error',
      toastMessage: errorMessage,
      toastType: 'ERROR',
      getToastIcon: (size) => <MdError size={size} color="red" />,
    });
  };

  return (
    <Section
      flexDirection="column"
      gap="25px"
      width={isMobile ? '300px' : '400px'}
    >
      <Section margin="0 0 10px 0">
        <ModalHeader
          handleClose={onClose}
          handlePrevious={handlePrevious}
          title={
            criteriaState.isUpdateCriteriaEnabled()
              ? 'Update Criteria'
              : 'Add Criteria'
          }
        />
      </Section>
      <DropDownInput
        labelName="Type"
        selectedValue={selectedTypeValue}
        dropdownValues={dropdownTypeValues}
      />
      {Array.isArray(getCategoryDropdownValues()) ? (
        <DropDownInput
          labelName="Gating Category"
          selectedValue={selectedCategoryValue}
          dropdownValues={getCategoryDropdownValues() as DropdownValueType[]}
        />
      ) : (
        <TextInput
          labelName="Gating category"
          inputValue={(getCategoryDropdownValues() as ReadonlyInputType)?.title}
          disabled={true}
          customStyle={{
            background: theme.backgroundColor?.modalHoverBackground,
          }}
        />
      )}

      {Array.isArray(getSubCategoryDropdownValues()) ? (
        <DropDownInput
          labelName="Sub-Category"
          selectedValue={selectedSubCategoryValue}
          dropdownValues={getSubCategoryDropdownValues() as DropdownValueType[]}
        />
      ) : (
        <TextInput
          labelName="Sub-category"
          inputValue={
            (getSubCategoryDropdownValues() as ReadonlyInputType)?.title
          }
          disabled={true}
          customStyle={{
            background: theme.backgroundColor?.modalHoverBackground,
          }}
        />
      )}
      {/* shift to minor components  leave for now*/}
      {checkIfTokenNFT() && (
        <>
          <DropDownInput
            labelName="Blockchain"
            selectedValue={selectedChainValue}
            dropdownValues={dropdownChainsValues}
          />
          <Section gap="10px" flexDirection="column" alignItems="start">
            <TextInput
              labelName="Contract"
              inputValue={contract}
              onInputChange={(e: any) => setContract(e.target.value)}
              placeholder="e.g. 0x123..."
              error={!!validationErrors?.tokenError}
            />
            {!!validationErrors?.tokenError && (
              <ErrorSpan>{validationErrors?.tokenError}</ErrorSpan>
            )}
          </Section>
          <Section gap="10px" flexDirection="column" alignItems="start">
          <QuantityInput
            dropDownValues={dropdownQuantityRangeValues}
            labelName="Quantity"
            inputValue={quantity}
            error={!!validationErrors?.tokenAmount}
            onInputChange={onQuantityChange}
            placeholder="e.g. 1.45678"
            unit={unit}
          />
          {!!validationErrors?.tokenAmount && (
              <ErrorSpan>{validationErrors?.tokenAmount}</ErrorSpan>
            )}
          </Section>
        </>
      )}

      {checkIfCustomEndpoint() && (
         <Section gap="10px" flexDirection="column" alignItems="start">
        <TextInput
          labelName="URL"
          inputValue={url}
          onInputChange={(e: any) => setUrl(e.target.value)}
          placeholder="e.g. abc.com"
          error={!!validationErrors?.url}
        />
           {!!validationErrors?.url && (
              <ErrorSpan>{validationErrors?.url}</ErrorSpan>
            )}
        </Section>
      )}
      {checkIfPushInvite() && (
        <Section flexDirection="column" gap="10px">
          {Object.keys(INVITE_CHECKBOX_LABEL).map((key) => (
            <Checkbox
              labelName={
                INVITE_CHECKBOX_LABEL[key as keyof typeof INVITE_CHECKBOX_LABEL]
              }
              onToggle={() =>
                setInviteCheckboxes({
                  admin: true,
                  owner: true,
                })
              }
              checked={
                inviteCheckboxes[key as keyof typeof INVITE_CHECKBOX_LABEL]
              }
            />
          ))}
        </Section>
      )}

      {checkIfGuild() && (
        <>
          <Section gap="10px" flexDirection="column" alignItems="start">
            <TextInput
              labelName="ID"
              inputValue={guildId}
              onInputChange={(e: any) => setGuildId(e.target.value)}
              placeholder="e.g. 4687"
              error={!!validationErrors?.guildId}
            />
            {!!validationErrors?.guildId && (
              <ErrorSpan>{validationErrors?.guildId}</ErrorSpan>
            )}
          </Section>
          <Section gap="10px" flexDirection="column" alignItems="start">
            <OptionButtons
              options={GUILD_COMPARISON_OPTIONS}
              totalWidth="410px"
              selectedValue={guildComparison}
              error={!!validationErrors?.guildComparison}
              handleClick={(newEl: string) => {
                setGuildComparison(newEl);
              }}
            />
            {!!validationErrors?.guildComparison && (
              <ErrorSpan>{validationErrors?.guildComparison}</ErrorSpan>
            )}
          </Section>
          {guildComparison === 'specific' && (
            <Section gap="10px" flexDirection="column" alignItems="start">
              <TextInput
                labelName="Specific Role"
                inputValue={specificRoleId}
                onInputChange={(e: any) => setSpecificRoleId(e.target.value)}
                placeholder="e.g. 4687"
                error={!!validationErrors?.guildRole}
              />
              {!!validationErrors?.guildRole && (
                <ErrorSpan>{validationErrors?.guildRole}</ErrorSpan>
              )}
            </Section>
          )}
        </>
      )}
      <Button width="197px" onClick={verifyAndDoNext}>
        {!validationLoading &&
          (criteriaState.isUpdateCriteriaEnabled() ? 'Update' : 'Add')}
        {validationLoading && <Spinner size="20" color="#fff" />}
      </Button>
      <GatingRulesInformation />
    </Section>
  );
};

export default AddCriteria;

const ErrorSpan = styled(Span)`
  font-size: 12px;
  font-weight: 500;
  color: #ed5858;
`;
