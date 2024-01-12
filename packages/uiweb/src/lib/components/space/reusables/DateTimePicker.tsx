/* eslint-disable prefer-const */
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

import { ThemeContext } from '../theme/ThemeProvider';

interface DateTimePickerProps {
    propsDate: Date;
    propsTime: string;
    onDateChange?: any;
    onTimeChange?: any;
}

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
    const {
        propsDate, onDateChange, onTimeChange,
    } = props;
    const theme = useContext(ThemeContext);

    const [selectedHours, setSelectedHours] = useState('0');
    const [selectedMinutes, setSelectedMinutes] = useState('0');
    const [selectedAMPM, setSelectedAMPM] = useState('AM');
    const [timeHumanReadable, setTimeHumanReadable] = useState(0);
    console.debug("🚀 ~ file: DateTimePicker.tsx:24 ~ timeHumanReadable:", timeHumanReadable)

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(event.target.value);
        onDateChange(date);
    };

    const getTime = (hours: number, minutes: number, ampm: string, propsDate: Date) => {
        let totalMinutes = hours * 60 + minutes;

        if (ampm === 'PM' && hours !== 12) {
          totalMinutes += 12 * 60;
        } else if (ampm === 'AM' && hours === 12) {
          totalMinutes -= 12 * 60;
        }

        const date = new Date(propsDate);
        date.setHours(0, 0, 0, 0);
        date.setMinutes(totalMinutes);

        return date.getTime();
    };

    useEffect(() => {
        const hours = parseInt(selectedHours, 10);
        const minutes = parseInt(selectedMinutes, 10);
        const ampm = selectedAMPM;

        const newTimeEpoch = getTime(hours, minutes, ampm, propsDate);
        setTimeHumanReadable(newTimeEpoch);

        onTimeChange(newTimeEpoch)
    }, [selectedHours, selectedMinutes, selectedAMPM, propsDate]);

    return (
        <DateTimeCont>
            <div>Select date and time</div>
            <Input theme={theme} type="date" value={propsDate.toISOString().split('T')[0]} onChange={handleDateChange} />
            <TimeContainer>
                <Select
                    theme={theme}
                    value={selectedHours}
                    onChange={(e) => setSelectedHours(e.target.value)}
                    placeholder='Hours'
                >
                    <option value={'00'}>12</option>
                    <option value={'01'}>01</option>
                    <option value={'02'}>02</option>
                    <option value={'03'}>03</option>
                    <option value={'04'}>04</option>
                    <option value={'05'}>05</option>
                    <option value={'06'}>06</option>
                    <option value={'07'}>07</option>
                    <option value={'08'}>08</option>
                    <option value={'09'}>09</option>
                    <option value={'10'}>10</option>
                    <option value={'11'}>11</option>
                </Select>
                <Select
                    theme={theme}
                    value={selectedMinutes}
                    onChange={(e) => setSelectedMinutes(e.target.value)}
                    placeholder='Minutes'
                >
                    <option value={'00'}>00</option>
                    <option value={'15'}>15</option>
                    <option value={'30'}>30</option>
                    <option value={'45'}>45</option>
                </Select>
                <Select
                    theme={theme}
                    value={selectedAMPM}
                    onChange={(e) => setSelectedAMPM(e.target.value)}
                    placeholder='AM/PM'
                >
                    <option value={'AM'}>AM</option>
                    <option value={'PM'}>PM</option>
                </Select>
            </TimeContainer>
        </DateTimeCont>
    );
};

const DateTimeCont = styled.div`
    display: flex;
    flex-direction: column;

    margin-top: 24px;
`;

const Input = styled.input`
    padding: 16px;
    margin-top: 12px;

    width: 330px;

    background: #FFFFFF;
    border: 2px solid ${(props => props.theme.btnOutline)};
    border-radius: 12px;

    font-size: 16px;
    font-family: 'Strawford';
`;

const TimeContainer = styled.div`
    display: flex;
    width: 100%;
    gap: 12px;
`;

const Select = styled.select<{ width?: string }>`
    padding: 16px;
    margin-top: 12px;

    background: #FFFFFF;
    border: 2px solid ${(props => props.theme.btnOutline)};
    border-radius: 12px;

    font-size: 16px;
    font-family: 'Strawford';
    width: ${(props => props.width ? props.width : '100%')};
`;

export default DateTimePicker;
