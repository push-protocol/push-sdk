import React, { ComponentPropsWithoutRef, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface RangeSliderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
  disabled?: boolean;
  startVal: number;
  endVal: number;
  min: number;
  max: number;
  step: number;
  defaultStartVal: number;
  defaultEndVal: number;
  preview?: boolean;
  onChange: (value: { startVal: number, endVal: number }) => void;
  onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
  onDragEnd?: (e: React.MouseEvent | React.TouchEvent) => void;
}

const RangeSlider = ({
  disabled,
  startVal,
  endVal,
  min,
  max,
  step,
  defaultStartVal,
  defaultEndVal,
  onChange,
  onDragStart,
  onDragEnd,
  preview = false,
  ...props
}: RangeSliderProps) => {
  const thumbStartRef = useRef<HTMLDivElement>(null);
  const thumbEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewSliderStartRef = useRef<HTMLDivElement>(null);
  const previewSliderEndRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const inactiveLeftRef = useRef<HTMLDivElement>(null);
  const inactiveRightRef = useRef<HTMLDivElement>(null);

  const handleMouseDownLeftThumb = (e: any) => {
    if (disabled) return;
    if (onDragStart) onDragStart(e);
    // Add event listeners for mousemove and touchmove to track thumb movement
    document.addEventListener('mousemove', handleMouseMoveLeftThumb);
    document.addEventListener('mouseup', handleMouseUpLeftThumb);
    document.addEventListener('touchmove', handleMouseMoveLeftThumb);
    document.addEventListener('touchend', handleMouseUpLeftThumb);
  };

  const handleMouseMoveLeftThumb = (e: { touches?: any; clientX?: any; }) => {
    if (disabled) return;
    if (!containerRef.current) return;
    
    const { left, width } = containerRef.current.getBoundingClientRect();
    const { clientX } = e instanceof MouseEvent ? e : e.touches[0];
    let x = (clientX - left) / width;
    const lowerBound = defaultStartVal - Math.floor((defaultStartVal - min) / step) * step;
    const upperBound = defaultStartVal + Math.floor((max - defaultStartVal) / step) * step;

    if (x <= 0) x = lowerBound;
    else if (x >= 1) x = upperBound;
    else {
      const stepCount = Math.floor((x * (max - min) + min - defaultStartVal) / step);
      x = defaultStartVal + stepCount * step;
      if (x < lowerBound) x = lowerBound;
      if (x > upperBound) x = upperBound;
    }
    const decimalPlaces = (step.toString().split('.')[1] || '').length;

    if (Number(x.toFixed(decimalPlaces)) >= endVal) return;
    onChange({ startVal: Number(x.toFixed(decimalPlaces)), endVal: endVal });
  };  

  const handleMouseUpLeftThumb = (e: any) => {
    if (disabled) return;
    if (onDragEnd) onDragEnd(e);
    // Remove event listeners when the dragging ends
    document.removeEventListener('mousemove', handleMouseMoveLeftThumb);
    document.removeEventListener('mouseup', handleMouseUpLeftThumb);
    document.removeEventListener('touchmove', handleMouseMoveLeftThumb);
    document.removeEventListener('touchend', handleMouseUpLeftThumb);
  };

  const handleMouseDownRightThumb = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    if (onDragStart) onDragStart(e);
    // Add event listeners for mousemove and touchmove to track thumb movement
    document.addEventListener('mousemove', handleMouseMoveRightThumb);
    document.addEventListener('mouseup', handleMouseUpRightThumb);
    document.addEventListener('touchmove', handleMouseMoveRightThumb);
    document.addEventListener('touchend', handleMouseUpRightThumb);
  };

  const handleMouseMoveRightThumb = (e: { touches?: any; clientX?: any; }) => {
    if (disabled) return;
    if (!containerRef.current) return;
    
    const { left, width } = containerRef.current.getBoundingClientRect();
    const { clientX } = e instanceof MouseEvent ? e : e.touches[0];
    let x = (clientX - left) / width;
    const lowerBound = defaultEndVal - Math.floor((defaultEndVal - min) / step) * step;
    const upperBound = defaultEndVal + Math.floor((max - defaultEndVal) / step) * step;

    if (x <= 0) x = lowerBound;
    else if (x >= 1) x = upperBound;
    else {
      const stepCount = Math.floor((x * (max - min) + min - defaultEndVal) / step);
      x = defaultEndVal + stepCount * step;
      if (x < lowerBound) x = lowerBound;
      if (x > upperBound) x = upperBound;
    }
    const decimalPlaces = (step.toString().split('.')[1] || '').length;

    if (Number(x.toFixed(decimalPlaces)) <= startVal) return;

    onChange({ startVal: startVal, endVal: Number(x.toFixed(decimalPlaces)) });
  };  

  const handleMouseUpRightThumb = (e:any) => {
    if (disabled) return;
    if (onDragEnd) onDragEnd(e);
    // Remove event listeners when the dragging ends
    document.removeEventListener('mousemove', handleMouseMoveRightThumb);
    document.removeEventListener('mouseup', handleMouseUpRightThumb);
    document.removeEventListener('touchmove', handleMouseMoveRightThumb);
    document.removeEventListener('touchend', handleMouseUpRightThumb);
  };

  const showPreview = () => {
    previewSliderStartRef.current?.style.setProperty('display', 'flex');
    previewSliderEndRef.current?.style.setProperty('display', 'flex');
  }

  const hidePreview = () => {
    previewSliderStartRef.current?.style.setProperty('display', 'none');
    previewSliderEndRef.current?.style.setProperty('display', 'none');
  }

  useEffect(() => {
    if (thumbStartRef.current && inactiveLeftRef.current && thumbEndRef.current && activeRef.current && inactiveRightRef.current) {
      thumbStartRef.current.style.left = `${((startVal - min) / (max - min)) * 98}%`;
      inactiveLeftRef.current.style.width = `${((startVal - min) / (max - min)) * 100}%`;
      activeRef.current.style.width = `${((endVal - startVal) / (max - min)) * 100}%`;
      thumbEndRef.current.style.left  = `${((endVal - min) / (max - min)) * 95}%`;
      inactiveRightRef.current.style.width = `${((max - endVal) / (max - min)) * 100}%`;

      previewSliderStartRef.current?.style.setProperty(
        'left',
        `${((Number(startVal) - Number(min)) / (Number(max) - Number(min))) * 90}%`
      );
      previewSliderEndRef.current?.style.setProperty(
        'left',
        `${((Number(endVal) - Number(min)) / (Number(max) - Number(min))) * 90}%`
      );
    }
  }, [thumbStartRef, thumbEndRef, activeRef, inactiveLeftRef, inactiveRightRef, startVal, endVal, min, max]);

  return (
    <Container
      ref={containerRef}
      onMouseEnter={showPreview}
      onMouseLeave={hidePreview}
      onTouchStart={showPreview}
      onTouchEnd={hidePreview}
      {...props}
      {...props}
    >
        <Inactive ref={inactiveLeftRef} />
        <Thumb
            ref={thumbStartRef}
            onTouchStart={handleMouseDownLeftThumb}
            onMouseDown={handleMouseDownLeftThumb}
            onTouchEnd={handleMouseUpLeftThumb}
            onMouseUp={handleMouseUpLeftThumb}
        />
        <Active ref={activeRef} />
        <Thumb
            ref={thumbEndRef}
            onTouchStart={handleMouseDownRightThumb}
            onMouseDown={handleMouseDownRightThumb}
            onTouchEnd={handleMouseUpRightThumb}
            onMouseUp={handleMouseUpRightThumb}
        />
        <Inactive ref={inactiveRightRef} />
        {preview && !Number.isNaN(Number(startVal)) && <PreviewContainer ref={previewSliderStartRef}>{startVal}</PreviewContainer>}
        {preview && !Number.isNaN(Number(endVal)) && <PreviewContainer ref={previewSliderEndRef}>{endVal}</PreviewContainer>}
    </Container>
  );
};

const Thumb = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.theme.default.bg};
  border: 1px solid ${(props) => props.theme.default.border};
  border-radius: 50%;
  user-select: none;
  cursor: pointer;
  z-index: 1;
  position: absolute;
`;

const Active = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${(props) => props.theme.default.primaryPushThemeTextColor};
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const Inactive = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${(props) => props.theme.snfBorder};
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const Container = styled.div`
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 1;
  width: 100%;
`;

const PreviewContainer = styled.div`
  display: none;
  position: absolute;
  bottom: -48px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.default.border};
  background: ${(props) => props.theme.default.bg};
  color: ${(props) => props.theme.default.color};
  width: max-content;
  padding: 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const SliderRange = styled.div`
  position: absolute;
  height: 4px;
  background-color: #999;
`;

export default RangeSlider;
