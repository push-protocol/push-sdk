import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../theme/ThemeProvider';

interface DateTimePickerProps {
    onDateTimeChange: (dateTime: Date) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({ onDateTimeChange }) => {
    const theme = useContext(ThemeContext);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>('00:00');

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(event.target.value);
        setSelectedDate(date);
        onDateTimeChange(new Date(date.getFullYear(), date.getMonth(), date.getDate(), getHours(selectedTime), getMinutes(selectedTime)));
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const time = event.target.value;
        setSelectedTime(time);
        onDateTimeChange(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), getHours(time), getMinutes(time)));
    };

    const getHours = (timeString: string) => {
        const [hours] = timeString.split(':');
        return parseInt(hours, 10);
    };

    const getMinutes = (timeString: string) => {
        const [, minutes] = timeString.split(':');
        return parseInt(minutes, 10);
    };

    return (
        <DateTimeCont>
            <div>Select date and time</div>
            <Input theme={theme} type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />
            <Select theme={theme} value={selectedTime} onChange={handleTimeChange}>
                <option value="00:00">12:00 AM</option>
                <option value="01:00">1:00 AM</option>
                <option value="01:00">2:00 AM</option>
                <option value="01:00">3:00 AM</option>
                <option value="01:00">4:00 AM</option>
                <option value="23:00">11:00 PM</option>
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
