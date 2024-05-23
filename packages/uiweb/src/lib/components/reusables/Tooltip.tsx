import React, { useState } from 'react';
import styled from 'styled-components';


type TooltipPropType = {
  children: React.ReactNode;
  direction?: string;
  content?: string;
  delay?: number;
};
export const Tooltip: React.FC<TooltipPropType> = ({
  children,
  content,
  direction,
  delay,
}) => {
  let timeout: NodeJS.Timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <TooltipWrapper
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
      id='tooltip-span'
    >
      {/* Wrapping */}
      {children}
      {active && (
       content && 
        <TooltipContent className={`${direction || 'top'}`}>
          {/* Content */}
          {content}
        </TooltipContent>
     )} 
    </TooltipWrapper>
  );
};



//styles
/* Wrapping */
const TooltipWrapper = styled.div`
/* Custom properties */

  display: flex;
  position: relative;
  z-index: 1;
`;

/* Absolute positioning */
const TooltipContent = styled.div`
  position: absolute;
  border-radius: 8px 8px 8px 4px;
  left: 50%;
  transform: translateX(-50%);
  padding: 7px;
  color: #fff;
  background: #000;
  font-size: 12px;
  font-weigth:400;
  font-family: sans-serif;
  line-height: 1;
  z-index: 100;
  white-space: nowrap;

  // /* CSS border triangles */
  // &::before {
  //   content: ' ';
  //   left: 50%;
  //   border: solid transparent;
  //   height: 0;
  //   width: 0;
  //   position: absolute;
  //   pointer-events: none;
  //   border-width: 6px;
  //   margin-left: calc(6px * -1);
  // }

  &.top {
    top: calc(30px * -1);
    &::before {
      top: 100%;
      border-top-color: #000;
    }
  }
  &.right {
    left: calc(100% + 10px);
    top: 50%;
    transform: translateX(0) translateY(-50%);
    &::before {
      left: calc(6px * -1);
      top: 50%;
      transform: translateX(0) translateY(-50%);
      border-right-color: #000;
    }
  }
  &.bottom {
    bottom: calc(30px * -1);
    &::before {
      bottom: 100%;
      border-bottom-color: #000;
    }
  }
  &.bottom-right {
    bottom: calc(30px * -1);
    transform: translateX(-32%) translateY(5%);
    &::before {
        bottom: 100%;
        border-bottom-color: #000;
        left: 10%;
    }
  }
  &.left {
    left: auto;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateX(0) ;
    &::before {
      left: auto;
      right: calc(6px * -2);
      top: 50%;
      transform: translateX(0) translateY(-50%);
      border-left-color: #000;
    }
  }
`;
