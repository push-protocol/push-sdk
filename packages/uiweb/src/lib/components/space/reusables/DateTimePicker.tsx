import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

interface DateTimePickerProps {
    propsDate: Date;
    propsTime: string;
    onDateChange?: any;
    onTimeChange?: any;
}

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
    const theme = useContext(ThemeContext);

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(event.target.value);
        props.onDateChange(date);
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const time = event.target.value;
        props.onTimeChange(time);
    };

    return (
        <DateTimeCont>
            <div>Select date and time</div>
            <Input theme={theme} type="date" value={props.propsDate.toISOString().split('T')[0]} onChange={handleDateChange} />
            <Select theme={theme} value={props.propsTime} onChange={handleTimeChange}>
                <option value="00:00">{new Date().getTime()}</option>
            </Select>
        </DateTimeCont>
    );
};

const DateTimeCont = styled.div`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    padding: 16px;
    margin-top: 12px;

    width: 330px;

    background: #FFFFFF;
    border: 1px solid ${(props => props.theme.btnOutline)};
    box-shadow: -1px -1px 2px ${(props => props.theme.btnOutline)}, 1px 1px 2px ${(props => props.theme.btnOutline)};
    border-radius: 12px;

    font-size: 16px;
`;

const Select = styled.select`
    padding: 16px;
    margin-top: 12px;

    background: #FFFFFF;
    border: 1px solid ${(props => props.theme.btnOutline)};
    box-shadow: -1px -1px 2px ${(props => props.theme.btnOutline)}, 1px 1px 2px ${(props => props.theme.btnOutline)};
    border-radius: 12px;

    font-size: 14px;
`;

export default DateTimePicker;
