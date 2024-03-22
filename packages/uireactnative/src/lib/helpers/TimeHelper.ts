export const TimeHelper = {
  convertTimeStamp(timeStamp: string) {
    const date = new Date(parseInt(timeStamp, 10) * 1000);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const meridiem = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    const formattedHours = parseInt(hours, 10) % 12 || 12;

    const formattedDate = `${day} ${month} ${year} | ${formattedHours}:${minutes} ${meridiem}`;

    return formattedDate;
  },
};
