/**
 * @file theme file: all the predefined themes are defined here
 */

//theme type
interface IBorder {
  modal?: string;
  modalInnerComponents?: string;
  sliderThumb?:string;
  divider?:string;
}
interface IBorderRadius {
  modal?: string;
  modalInnerComponents?: string;
}
interface IBackgroundColor {
  buttonBackground?: string;
  buttonDisableBackground?: string;
  modalBackground?: string;
  toastSuccessBackground?: string;
  toastErrorBackground?: string;
  toastShadowBackground?: string;
  sliderThumbBackground?:string;
  sliderActiveBackground?:string;
  sliderInActiveBackground?:string;
}

interface ITextColor {
  buttonText?: string;
  buttonDisableText?: string;
  modalHeaderText?: string;
  modalTitleText?: string;
  modalSubTitleText?: string;
  modalHighlightedText?: string;
}
// interface IFont {
//     buttonText?: string;
//     buttonDisableText?: string;
//     modalHeadingText?:string;
//     modalSubHeadingText?:string;
// }
// interface IFontWeight {
//     buttonText?: string;
//     buttonDisableText?: string;
//     modalHeadingText?:string;
//     modalSubHeadingText?:string;
// }

export interface IWidgetTheme {
  borderRadius?: IBorderRadius;

  backgroundColor?: IBackgroundColor;

  //   fontSize?: IFont;

  //   fontWeight?: IFontWeight;

  fontFamily?: string;

  border?: IBorder;
  textColor?: ITextColor;
  scrollbarColor?: string;

  spinnerColor?: string;
}

//dark theme object
export const lightWidgetTheme: IWidgetTheme = {
  borderRadius: {
    modal: '12px',
    modalInnerComponents: '8px',
  },

  backgroundColor: {
    buttonBackground: '#CE4DE4',
    modalBackground: '#fff',
    buttonDisableBackground: '#DFDEE9',
    toastSuccessBackground:
      'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #F3FFF9 42.81%)',
    toastErrorBackground:
      'linear-gradient(90.15deg, #FF2070 -125.65%, #FF2D79 -125.63%, #FFF9FB 42.81%)',
    toastShadowBackground: '#ccc',
    sliderActiveBackground:'#CE4DE4',
    sliderInActiveBackground:'#BAC4D6',
    sliderThumbBackground:'#fff'
  },

  //   fontSize: {

  //   },

  //   fontWeight: {

  //   },

  fontFamily: 'inherit',

  border: {
    modal: '1px solid rgba(0, 0, 0, 0.1)',
    modalInnerComponents: '1px solid rgb(194, 203, 219)',
    sliderThumb:'1px solid #D4DCEA',
    divider:'1px solid #D4DCEA'
  },

  textColor: {
    buttonText: '#fff',
    buttonDisableText: '#AFB3BF',
    modalHeaderText: '#000',
    modalHighlightedText: '#CE4DE4',
    modalTitleText: '#000',
    modalSubTitleText: '#575D73',
  },
  spinnerColor: '#CE4DE4',
  scrollbarColor: '#CE4DE4',
};

export const darkWidgetTheme: IWidgetTheme = {
  borderRadius: {
    modal: '12px',
    modalInnerComponents: '8px',
  },

  backgroundColor: {
    buttonBackground: '#CE4DE4',
    modalBackground: 'rgb(47, 49, 55)',

    buttonDisableBackground: '#787E99',
    toastSuccessBackground:
      'linear-gradient(90.15deg, #30CC8B -125.65%, #30CC8B -125.63%, #2F3137 42.81%)',
    toastErrorBackground:
      'linear-gradient(89.96deg, #FF2070 -101.85%, #2F3137 51.33%)',
    toastShadowBackground: '#00000010',
    sliderActiveBackground:'#CE4DE4',
    sliderInActiveBackground:'#4A4F67',
    sliderThumbBackground:'#fff'
  },

  //   fontSize: {

  //   },

  //   fontWeight: {

  //   },

  fontFamily: 'inherit',

  border: {
    modal: 'none',
    modalInnerComponents: '1px solid rgb(74, 79, 103)',
    sliderThumb:'rgba(0, 0, 0, 0.10)',
    divider:'1px solid #4A4F67'
  },

  textColor: {
    buttonText: '#fff',


    modalHeaderText: '#fff',
    modalHighlightedText: '#CE4DE4',
    modalTitleText: '#fff',
    modalSubTitleText: '#B6BCD6',
    buttonDisableText: '#B6BCD6',
  },
  spinnerColor: '#CE4DE4',
  scrollbarColor: '#CE4DE4',
};
