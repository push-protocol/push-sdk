/* eslint-disable prefer-const */
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

import { Modal } from './Modal';

import { ThemeContext } from '../theme/ThemeProvider';

interface DateTimePickerProps {
    propsDate: Date;
    propsTime: string;
    onDateChange?: any;
    onTimeChange?: any;
}

// interface Time {
//     hours: string;
//     minutes: string;
//     period: string;
// }

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
    const theme = useContext(ThemeContext);

    // const [time, setTime] = useState<Time>({
    //     hours: '00',
    //     minutes: '00',
    //     period: 'AM'
    // });

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(event.target.value);
        props.onDateChange(date);
    };

    // const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const time = event.target.value;
    //     props.onTimeChange(time);
    // };

    // const handleChange = (event: any) => {
    //     setTime({
    //         ...time,
    //         [event.target.name]: event.target.value
    //     });
    // };

    // const getTimeInEpoch = () => {
    //     let { hours, minutes, period } = time;
    //     hours = hours === '12' ? '00' : hours;
    //     hours = period === 'PM' ? parseInt(hours, 10) + 12 : hours;
    //     const date = new Date();
    //     date.setHours(hours);
    //     date.setMinutes(minutes);
    //     const epochTime = date.getTime();
    //     console.log(epochTime);
    // };

    // useEffect(() => {
    //     getTimeInEpoch();
    // }, [time]);

    return (
        <DateTimeCont>
            <div>Select date and time</div>
            <Input theme={theme} type="date" value={props.propsDate.toISOString().split('T')[0]} onChange={handleDateChange} />
            <TimeContainer>
                <Select
                    theme={theme}
                    // value={props.propsTime}
                    // onChange={handleChange}
                    placeholder='Hours'
                >
                    <option value={'00'}>00</option>
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
                    // value={props.propsTime}
                    // onChange={handleChange}
                    placeholder='Minutes'
                >
                    <option value={'00'}>00</option>
                    <option value={'15'}>15</option>
                    <option value={'30'}>30</option>
                    <option value={'45'}>45</option>
                </Select>
                <Select
                    theme={theme}
                    // value={props.propsTime}
                    // onChange={handleChange}
                    placeholder='AM/PM'
                    width='40%'
                >
                    <option value={'AM'}>AM</option>
                    <option value={'PM'}>PM</option>
                </Select>
            </TimeContainer>
            {/* <Select theme={theme} value={props.propsTime} onChange={handleTimeChange}>
                <option value={new Date().getTime()}>Current Time</option>
            </Select> */}
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
    border: 1px solid ${(props => props.theme.btnOutline)};
    box-shadow: -1px -1px 2px ${(props => props.theme.btnOutline)}, 1px 1px 2px ${(props => props.theme.btnOutline)};
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
    border: 1px solid ${(props => props.theme.btnOutline)};
    box-shadow: -1px -1px 2px ${(props => props.theme.btnOutline)}, 1px 1px 2px ${(props => props.theme.btnOutline)};
    border-radius: 12px;

    font-size: 16px;
    font-family: 'Strawford';
    width: ${(props => props.width ? props.width : '100%')};
`;

export default DateTimePicker;
