/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from 'styled-components';
import { ReactComponent as DarkSVGIcon } from '../../assets/dark.svg';
import { ReactComponent as LightSVGIcon } from '../../assets/light.svg';


const SVGIconButton = styled.div`
  cursor: pointer;
`;

type IconProp = {
  onClick: (arg0: any) => any,
  title: string
};

export const DarkIcon = ({ title, onClick }: IconProp) => <SVGIconButton title={title} onClick={onClick}><DarkSVGIcon /></SVGIconButton>;
export const LightIcon = ({ title, onClick }: IconProp) => <SVGIconButton title={title} onClick={onClick}><LightSVGIcon /></SVGIconButton>;
