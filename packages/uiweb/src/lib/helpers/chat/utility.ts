export const shortenText = (text: string,len: number) => {
    if (text?.length > 20) return text.substring(0, len) + '...';
    else return text;
  };


export  const shortenNumber = (val: number) => {
    if (val >= 10) return '10+';
    return val;
  };

  export const formatFileSize = (size: number): string => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(1)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
  };