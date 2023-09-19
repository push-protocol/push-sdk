import styled from 'styled-components';

type SpanStyleProps = {
  alignSelf?: string;
  background?: string;
  borderRadius?: string;
  border?: string;
  bottom?: string;
  flex?: string;
  fontSize?: string;
  fontWeight?: string;
  left?: string;
  letterSpacing?: string;
  lineHeight?: string;
  margin?: string;
  padding?: string;
  position?: string;
  textAlign?: string;
  right?: string;
  textTransform?: string;
  zIndex?: string;
  top?: string;
  maxWidth?: string;
  width?: string;
  cursor?: string;
};

export const Span = styled.span<SpanStyleProps>`
  align-self: ${(props) => props.alignSelf || 'auto'};
  background: ${(props) => props.background || 'transparent'};
  border-radius: ${(props) => props.borderRadius || 'initial'};
  border: ${(props) => props.border || 'initial'};
  bottom: ${(props) => props.bottom || 'auto'};
  color: ${(props) => props.color || 'inherit'};
  flex: ${(props) => props.flex || 'initial'};
  font-size: ${(props) => props.fontSize || 'inherit'};
  font-weight: ${(props) => props.fontWeight || '300'};
  left: ${(props) => props.left || 'auto'};
  letter-spacing: ${(props) => props.letterSpacing || 'inherit'};
  line-height: ${(props) => props.lineHeight || 'initial'};
  cursor: ${(props) => props.cursor || 'default'};
  margin: ${(props) => props.margin || '0px'};
  padding: ${(props) => props.padding || '0px'};
  position: ${(props) => props.position || 'relative'};
  right: ${(props) => props.right || 'auto'};
  text-align: ${(props) => props.textAlign || 'center'};
  text-transform: ${(props) => props.textTransform || 'inherit'};
  top: ${(props) => props.top || 'auto'};
  width: ${(props) => props.width || 'auto'};
  z-index: ${(props) => props.zIndex || 'auto'};
  max-width: ${(props) => props.maxWidth || 'initial'};
`;

type SectionStyleProps = {
  flexDirection?: string;
  gap?: string;
  cursor?: string;
  alignItems?: string;
  alignSelf?: string;
  minHeight?: string;
  minWidth?: string;
  margin?: string;
  gradient?: string;
  position?: string;
  padding?: string;
  overflow?: string;
  background?: string;
  justifyContent?: string;
  maxHeight?: string;
  height?: string;
  maxWidth?: string;
  width?: string;
  right?: string;
  bottom?: string;
  top?: string;
  left?: string;
  borderColor?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderRadius?: string;
  flex?: string;
  zIndex?: string;
};

export const Section = styled.div<SectionStyleProps>`
  display: flex;
  cursor: ${(props) => props.cursor || 'default'};
  flex: ${(props) => props.flex || 'default'};
  flex-direction: ${(props) => props.flexDirection || 'row'};
  gap: ${(props) => props.gap || '0px'};
  align-items: ${(props) => props.alignItems || 'center'};
  justify-content: ${(props) => props.justifyContent || 'center'};
  align-self: ${(props) => props.alignSelf || 'stretch'};
  margin: ${(props) => props.margin || '0px'};
  min-height: ${(props) => props.minHeight || 'auto'};
  max-height: ${(props) => props.maxHeight || 'auto'};
  max-width: ${(props) => props.maxWidth || 'auto'};
  min-width: ${(props) => props.minWidth || 'auto'};
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  overflow: ${(props) => props.overflow || 'default'};
  padding: ${(props) => props.padding || '0px'};
  position: ${(props) => props.position || 'relative'};
  background: ${(props) =>
    props.gradient
      ? props.gradient
      : props.background
      ? props.background
      : 'transparent' || 'transparent'};
  right: ${(props) => props.right || 'auto'};
  top: ${(props) => props.top || 'auto'};
  bottom: ${(props) => props.bottom || 'auto'};
  left: ${(props) => props.left || 'auto'};
  border-radius: ${(props) => props.borderRadius || '0px'};
  border-width: ${(props) => props.borderWidth || 'initial'};
  border-color: ${(props) => props.borderColor || 'initial'};
  border-style: ${(props) => props.borderStyle || 'initial'};
  z-index: ${(props) => props.zIndex || '0'};
`;

type ImageStyleProps = {
  display?: string;
  height?: string;
  maxHeight?: string;
  padding?: string;
  widthmargin?: string;
  verticalAlign?: string;
  borderRadius?: string;
  overflow?: string;
  cursor?: string;
  filter?: string;
  alt?: string;
  objectFit?: string;
  margin?: string;
};
export const Image = styled.img<ImageStyleProps>`
  display: ${(props) => props.display || 'flex'};
  height: ${(props) => props.height || 'auto'};
  max-height: ${(props) => props.maxHeight || 'initial'};
  padding: ${(props) => props.padding || '0px'};
  width: ${(props) => props.width || '100%'};
  margin: ${(props) => props.margin || '0px'};
  vertical-align: ${(props) => props.verticalAlign || 'auto'};
  border-radius: ${(props) => props.borderRadius || 'initial'};
  overflow: ${(props) => props.overflow || 'hidden'};
  cursor: ${(props) => props.cursor || 'default'};
  filter: ${(props) => props.filter || 'none'};
  alt: ${(props) => props.alt || 'Image'};
  object-fit: ${(props) => props.objectFit || 'fill'};
`;

type DivStyleProps = {
  height?: string;
  width?: string;
  cursor?: string;
  alignSelf?:string;
  margin?:string;
  textAlign?:string;
};
export const Div = styled.div<DivStyleProps>`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || '100%'};
   margin: ${(props) => props.margin || '0px'};
  cursor: ${(props) => props.cursor || 'default'};
  align-self: ${(props) => props.alignSelf || 'center'};
  text-align: ${(props) => props.textAlign || 'default'};
`;
