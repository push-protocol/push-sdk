/**
 * @file theme file: all the predefined themes are defined here
 */


export interface IChatTheme {
    bgColorPrimary?: string;
    bgColorSecondary?: string;
    textColorPrimary?: string;
    textColorSecondary?: string;
    //what should name of gray color
    //name of search bar color
    accentBgColor?:string;
    accentTextColor?:string;
    btnColorPrimary?: string;
    border?: string;
    borderRadius?: string;
    iconColorPrimary?: string;
    fontFamily?: string;
  }
  
  export const lightTheme: IChatTheme = {
    bgColorPrimary:'#fff',
    bgColorSecondary:'linear-gradient(179.97deg, #EEF5FF 0.02%, #ECE9FA 123.25%)',
    textColorPrimary:'#000',
    textColorSecondary:'rgb(101, 119, 149)',
    accentBgColor:'rgb(202, 89, 155)',
    accentTextColor:'#fff',
    btnColorPrimary:'rgb(202, 89, 155)',
    border:'none',
    borderRadius:'32px',
    iconColorPrimary:'none'
  };
  
  export const darkTheme: IChatTheme = {
    bgColorPrimary:'rgb(47, 49, 55)',
    bgColorSecondary:'rgb(40, 42, 46)',
    textColorPrimary:'#fff',
    textColorSecondary:'rgb(182, 188, 214)',
    accentBgColor:'rgb(202, 89, 155)',
    accentTextColor:'#fff',
    btnColorPrimary:'rgb(202, 89, 155)',
    border:'none',
    borderRadius:'32px',
    iconColorPrimary:'brightness(0) saturate(100%) invert(89%) sepia(8%) saturate(1567%) hue-rotate(191deg) brightness(86%) contrast(93%)'
  };
  