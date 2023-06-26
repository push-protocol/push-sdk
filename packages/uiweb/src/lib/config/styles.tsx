import React from 'react';
import styled, { css } from 'styled-components';

interface CommonStyles extends React.CSSProperties {
  // Add any additional custom style properties here
  customProperty?: string; // random for now
}

const commonStyle = css<CommonStyles>`
  display: ${(props) => props.display};
  position: ${(props) => props.position};
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  cursor: ${(props) => props.cursor};
  flex: ${(props) => props.flex};
  flex-direction: ${(props) => props.flexDirection};
  flex-wrap: ${(props) => props.flexWrap};
  gap: ${(props) => props.gap};
  align-self: ${(props) => props.alignSelf};
  align-items: ${(props) => props.alignItems};
  align-content: ${(props) => props.alignContent};
  justify-content: ${(props) => props.justifyContent};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  margin-top: ${(props) => props.marginTop};
  margin-left: ${(props) => props.marginLeft};
  margin-bottom: ${(props) => props.marginBottom};
  min-width: ${(props) => props.minWidth};
  max-width: ${(props) => props.maxWidth};
  overflow-y: ${(props) => props.overflowY};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  text-align: ${(props) => props.textAlign};
  filter: ${(props) => props.filter};
  box-shadow: ${(props) => props.boxShadow};
  top: ${(props) => props.top};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border: ${(props) => props.border};
  border-radius: ${(props) => props.borderRadius};
  overflow: ${(props) => props.overflow};
  z-index: ${(props) => props.zIndex};
`;

export const Item = styled.div<CommonStyles>`
  ${commonStyle}
`;

export const Anchor = styled.a<CommonStyles>`
  ${commonStyle}
`;

export const Container = styled.div<CommonStyles>`
  ${commonStyle}
`;

export const Image = styled.img<CommonStyles>`
  ${commonStyle}
`;

export const Heading = styled.h1<CommonStyles>`
  ${commonStyle}
`;

export const Button = styled.button<CommonStyles>`
  ${commonStyle}
`;

export const Text = styled.span<CommonStyles>`
  ${commonStyle}
`;