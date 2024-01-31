import React, { ComponentPropsWithoutRef, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface InputSliderProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onChange'> {
  disabled?: boolean;
  val: number;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  preview?: boolean;
  onChange: (value: { x: number }) => void;
  onDragStart?: (e: React.MouseEvent | React.TouchEvent) => void;
  onDragEnd?: (e: React.MouseEvent | React.TouchEvent) => void;
}

const InputSlider = ({
  disabled,
  val,
  min,
  max,
  step,
  defaultVal,
  onChange,
  onDragStart,
  onDragEnd,
  preview = false,
  ...props
}: InputSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const inactiveRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewSliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    if (onDragStart) onDragStart(e);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
  };

  const handleMouseMove = (e: { touches?: any; clientX?: any; }) => {
    if (disabled) return;
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const { clientX } = e instanceof MouseEvent ? e : e.touches[0];
    let x = (clientX - left) / width;
    const lowerBound = defaultVal - Math.floor((defaultVal - min) / step) * step;
    const upperBound = defaultVal + Math.floor((max - defaultVal) / step) * step;

    if (x <= 0) x = lowerBound;
    else if (x >= 1) x = upperBound;
    else {
      const stepCount = Math.floor((x * (max - min) + min - defaultVal) / step);
      x = defaultVal + stepCount * step;
      if (x < lowerBound) x = lowerBound;
      if (x > upperBound) x = upperBound;
    }
    const decimalPlaces = (step.toString().split('.')[1] || '').length;
    onChange({ x: Number(x.toFixed(decimalPlaces)) });
  };

  const handleMouseUp = (e:any) => {
    if (disabled) return;
    if (onDragEnd) onDragEnd(e);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
  };

  const showPreview = () => previewSliderRef.current?.style.setProperty('display', 'flex');
  const hidePreview = () => previewSliderRef.current?.style.setProperty('display', 'none');

  useEffect(() => {
    if (sliderRef.current && activeRef.current && inactiveRef.current) {
      const value = Math.min(max, Math.max(min, val));
      sliderRef.current.style.left = `${((value - min) / (max - min)) * 98}%`;
      activeRef.current.style.width = `${((value - min) / (max - min)) * 100}%`;
      inactiveRef.current.style.width = `${((max - value) / (max - min)) * 100}%`;
      previewSliderRef.current?.style.setProperty(
        'left',
        `${((Number(value) - Number(min)) / (Number(max) - Number(min))) * 90}%`
      );
    }
  }, [sliderRef, activeRef, inactiveRef, val, min, max]);

  return (
    <Container
      ref={containerRef}
      onMouseEnter={showPreview}
      onMouseLeave={hidePreview}
      onTouchStart={showPreview}
      onTouchEnd={hidePreview}
      {...props}
    >
      <Active ref={activeRef} />
      <Thumb
        ref={sliderRef}
        onTouchStart={handleMouseDown}
        onMouseDown={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onMouseUp={handleMouseUp}
      />
      <Inactive ref={inactiveRef} />
      {preview && !Number.isNaN(Number(val)) && <PreviewContainer ref={previewSliderRef}>{val}</PreviewContainer>}
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

export default InputSlider;
