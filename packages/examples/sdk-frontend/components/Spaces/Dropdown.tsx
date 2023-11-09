import React from 'react';

type DropdownOptionsType = {
    value: string,
    label: string
};

const Dropdown = ({
    style,
    label,
    value,
    width,
    options,
    onChange
}: {
    style?: any,
    label: string,
    value?: string,
    width?: string | number,
    options: DropdownOptionsType[],
    onChange: (arg0: any) => void 
}) => {
    return (
      <label style={{ display: 'flex', gap: 8, ...style }}>
        {label}
        <select value={value} onChange={onChange} style={{ width: width }}>
          {options.map((option) => (
            <option key={`option: ${option.label}`} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    );
};

export default Dropdown;