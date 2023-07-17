const LENSTER_URL = 'https://lenster.xyz';

export interface ILensterUrlProps {
  text: string;
  url: string;
}
export const generateLensterShareURL = ({text, url}: ILensterUrlProps): string => {
  const encodedText = encodeURIComponent(text);
  const encodedURL = encodeURIComponent(url);
  
  const outputURL = `${LENSTER_URL}/?text=${encodedText}&url=${encodedURL}`;
  
  return outputURL;
}
