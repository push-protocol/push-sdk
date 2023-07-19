/**
 * @file theme file: all the predefined themes are defined here
 */

export interface ISpacesTheme {
  titleBg?: string;
  titleTextColor?: string;
  bgColorPrimary?: string;
  bgColorSecondary?: string;
  textColorPrimary?: string;
  textColorSecondary?: string;
  textGradient?: string;
  btnColorPrimary?: string;
  btnOutline?: string;
  borderColor?: string;
  borderRadius?: string;
  containerBorderRadius?: string;
  statusColorError?: string;
  statusColorSuccess?: string;
  iconColorPrimary?: string;
  fontFamily?: string;
  outerBorderColor?: string;
}

export const lightTheme: ISpacesTheme = {
  titleBg: 'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%)',
  titleTextColor: '#fff',
  bgColorPrimary: '#fff',
  bgColorSecondary: '#EDE9FE',
  textColorPrimary: '#000',
  textColorSecondary: '#71717A',
  textGradient: 'linear-gradient(45deg, #B6A0F5, #F46EF6, #FFDED3, #FFCFC5)',
  btnColorPrimary: '#8B5CF6',
  btnOutline: '#8B5CF6',
  borderColor: '#DCDCDF',
  borderRadius: '17px',
  containerBorderRadius: '12px',
  statusColorError: '#E93636',
  statusColorSuccess: '#30CC8B',
  iconColorPrimary: '#82828A',
  outerBorderColor: '#DCDCDF',
};

export const darkTheme: ISpacesTheme = {
  titleBg: 'linear-gradient(87.17deg, #EA4EE4 0%, #D23CDF 0.01%, #8B5CF6 100%)',
  titleTextColor: '#fff',
  bgColorPrimary: '#000',
  bgColorSecondary: '#292344',
  textColorPrimary: '#fff',
  textColorSecondary: '#71717A',
  textGradient: 'linear-gradient(45deg, #B6A0F5, #F46EF6, #FFDED3, #FFCFC5)',
  btnColorPrimary: '#8B5CF6',
  btnOutline: '#8B5CF6',
  borderColor: '#3F3F46',
  borderRadius: '17px',
  containerBorderRadius: '12px',
  statusColorError: '#E93636',
  statusColorSuccess: '#30CC8B',
  iconColorPrimary: '#71717A',
  outerBorderColor: '#3F3F46',
};
