/**
 * @class ParticleEffectButton
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import anime from 'animejs';
import classNames from 'classnames';
import raf from 'raf';

import { CSSProperties } from 'react';
import styled from 'styled-components';

interface ParticleEffectButtonProps {
  hidden?: boolean;
  children?: React.ReactNode;
  className?: string;
  duration?: number;
  easing?: string | number[];
  type?: 'circle' | 'rectangle' | 'triangle';
  style?: 'fill' | 'stroke';
  direction?: 'left' | 'right' | 'top' | 'bottom';
  canvasPadding?: number;
  size?: number | (() => number);
  speed?: number | (() => number);
  color?: string;
  particlesAmountCoefficient?: number;
  oscillationCoefficient?: number;
  onBegin?: () => void;
  onComplete?: () => void;
}

interface ParticleOptions {
  x: number;
  y: number;
}

const noop = () => {
  // intentionally empty
};

export default class ParticleEffectButton extends Component<ParticleEffectButtonProps> {
  static propTypes = {
    hidden: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    duration: PropTypes.number,
    easing: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.number)]),
    type: PropTypes.oneOf(['circle', 'rectangle', 'triangle']),
    style: PropTypes.oneOf(['fill', 'stroke']),
    direction: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    canvasPadding: PropTypes.number,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    speed: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    color: PropTypes.string,
    particlesAmountCoefficient: PropTypes.number,
    oscillationCoefficient: PropTypes.number,
    onBegin: PropTypes.func,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    hidden: false,
    duration: 1000,
    easing: 'easeInOutCubic',
    type: 'circle',
    style: 'fill',
    direction: 'left',
    canvasPadding: 150,
    size: () => Math.floor(Math.random() * 3 + 1),
    speed: () => rand(4),
    color: '#000',
    particlesAmountCoefficient: 3,
    oscillationCoefficient: 20,
    onBegin: noop,
    onComplete: noop,
  };

  private _progress = 0;
  private _particles: any[] = [];
  private _canvas: HTMLCanvasElement | null = null;
  private _wrapper: HTMLDivElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _raf: number | null = null;

  override state = {
    status: this.props.hidden ? 'hidden' : 'normal',
    progress: 0,
  };

  _rect = {
    width: 0,
    height: 0,
  };

  override componentWillReceiveProps(props: ParticleEffectButtonProps) {
    if (props.hidden !== this.props.hidden) {
      const { status } = this.state;

      if (status === 'normal' && props.hidden) {
        this.setState({ status: 'hiding' }, this._startAnimation);
      } else if (status === 'hidden' && !props.hidden) {
        this.setState({ status: 'showing' }, this._startAnimation);
      } else if (status === 'hiding' && !props.hidden) {
        // TODO: show button in middle of hiding animation
      } else if (status === 'showing' && props.hidden) {
        // TODO: hide button in middle of showing animation
      }
    }
  }

  override render() {
    const { children, className, direction } = this.props;

    const { status, progress } = this.state;

    const wrapperStyles: CSSProperties = {};
    const contentStyles: CSSProperties = {};
    const canvasStyles: CSSProperties = {};

    if (status === 'hiding' || status === 'showing') {
      const prop = this._isHorizontal() ? 'translateX' : 'translateY';
      const size = this._isHorizontal() ? this._rect.width : this._rect.height;
      const value = direction === 'left' || direction === 'top' ? progress : -progress;
      const px = Math.ceil((size * value) / 100);

      wrapperStyles.transform = `${prop}(${px}px)`;
      contentStyles.transform = `${prop}(${-px}px)`;
    } else if (status === 'hidden') {
      wrapperStyles.visibility = 'hidden';
      canvasStyles.visibility = 'hidden';
    } else if (status === 'normal') {
      canvasStyles.visibility = 'hidden';
    }

    return (
      <Particles className={classNames(className)}>
        <Wrapper
          className={''}
          style={wrapperStyles}
          ref={this._wrapperRef}
        >
          {status !== 'hidden' && (
            <Content
              className={''}
              style={contentStyles}
            >
              {children}
            </Content>
          )}
        </Wrapper>

        <Canvas
          ref={this._canvasRef}
          style={canvasStyles}
        />
      </Particles>
    );
  }

  _canvasRef = (ref: HTMLCanvasElement | null) => {
    this._canvas = ref;
  };

  _wrapperRef = (ref: HTMLDivElement | null) => {
    this._wrapper = ref;
  };

  _startAnimation = () => {
    if (!this._canvas || !this._wrapper) return;

    const { duration, easing, canvasPadding = 150, onBegin } = this.props; // Default value set here

    const { status } = this.state;

    if (status === 'hiding') {
      this._progress = 0;
    } else {
      this._progress = 1;
    }

    this._particles = [];

    this._rect = this._wrapper.getBoundingClientRect();
    this._canvas.width = this._rect.width + canvasPadding * 2;
    this._canvas.height = this._rect.height + canvasPadding * 2;
    this._ctx = this._canvas.getContext('2d');

    anime({
      targets: { value: status === 'hiding' ? 0 : 100 },
      value: status === 'hiding' ? 100 : 0,
      duration: duration,
      easing: easing,
      begin: onBegin,
      update: (anim: any) => {
        const value = anim.animatables[0].target.value;
        setTimeout(() => {
          this.setState({ progress: value });
        });

        if (duration) {
          this._addParticles(value / 100);
        }
      },
    });
  };

  _cycleStatus() {
    const { status } = this.state;

    if (status === 'normal') {
      this.setState({ status: 'hiding' });
    } else if (status === 'hidden') {
      this.setState({ status: 'showing' });
    } else if (status === 'hiding') {
      this.setState({ status: 'hidden' });
    } else if (status === 'showing') {
      this.setState({ status: 'normal' });
    }
  }

  _loop = () => {
    this._updateParticles();
    this._renderParticles();

    if (this._particles.length) {
      this._raf = raf(this._loop);
    } else {
      this._raf = null;
      this._cycleStatus();
      if (this.props.onComplete) {
        this.props.onComplete();
      }
    }
  };

  _addParticles(progress: number) {
    const { canvasPadding, direction, particlesAmountCoefficient = 1 } = this.props;
    const { status } = this.state;
    const { width, height } = this._rect;

    const delta = status === 'hiding' ? progress - this._progress : this._progress - progress;
    const isHorizontal = this._isHorizontal();
    const progressValue = (isHorizontal ? width : height) * progress + delta * (status === 'hiding' ? 100 : 220);

    this._progress = progress;

    let x: number = canvasPadding ?? 150; // Ensure canvasPadding is not undefined
    let y: number = canvasPadding ?? 150; // Ensure canvasPadding is not undefined

    if (isHorizontal) {
      x += direction === 'left' ? progressValue : width - progressValue;
    } else {
      y += direction === 'top' ? progressValue : height - progressValue;
    }

    let i = Math.floor(particlesAmountCoefficient * (delta * 100 + 1));
    if (i > 0) {
      while (i--) {
        this._addParticle({
          x: x + (isHorizontal ? 0 : width * Math.random()),
          y: y + (isHorizontal ? height * Math.random() : 0),
        });
      }
    }

    if (!this._raf) {
      this._raf = raf(this._loop);
    }
  }

  _addParticle(opts: ParticleOptions) {
    const { duration, size, speed } = this.props;

    const { status } = this.state;

    const frames = ((duration || 1000) * 60) / 1000;
    const _speed = typeof speed === 'function' ? speed() : speed || 1; // Default speed set to 1 if undefined
    const _size = typeof size === 'function' ? size() : size;

    this._particles.push({
      startX: opts.x,
      startY: opts.y,
      x: status === 'hiding' ? 0 : _speed * -frames,
      y: 0,
      angle: rand(360),
      counter: status === 'hiding' ? 0 : frames,
      increase: (Math.PI * 2) / 100,
      life: 0,
      death: status === 'hiding' ? frames - 20 + Math.random() * 40 : frames,
      speed: _speed,
      size: _size,
    });
  }

  _updateParticles() {
    const { oscillationCoefficient = 1 } = this.props; // Default value set to 1

    const { status } = this.state;

    for (let i = 0; i < this._particles.length; i++) {
      const p = this._particles[i];

      if (p.life > p.death) {
        this._particles.splice(i, 1);
      } else {
        p.x += p.speed;
        p.y = oscillationCoefficient * Math.sin(p.counter * p.increase);
        p.life++;
        p.counter += status === 'hiding' ? 1 : -1;
      }
    }
  }

  _renderParticles() {
    const { color, type, style } = this.props;
    const { status } = this.state;

    if (!this._ctx || !this._canvas) return;

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.fillStyle = this._ctx.strokeStyle = color || '#000'; // Default to black if color is undefined

    for (let i = 0; i < this._particles.length; ++i) {
      const p = this._particles[i];

      if (p.life < p.death) {
        this._ctx.save(); // Save the current state
        this._ctx.translate(p.startX, p.startY);
        this._ctx.rotate((p.angle * Math.PI) / 180);
        this._ctx.globalAlpha = status === 'hiding' ? 1 - p.life / p.death : p.life / p.death;
        this._ctx.beginPath();

        switch (type) {
          case 'circle':
            this._ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
            break;
          case 'triangle':
            this._ctx.moveTo(p.x, p.y);
            this._ctx.lineTo(p.x + p.size, p.y + p.size);
            this._ctx.lineTo(p.x + p.size, p.y - p.size);
            break;
          case 'rectangle':
            this._ctx.rect(p.x, p.y, p.size, p.size);
            break;
        }

        if (style === 'fill') {
          this._ctx.fill();
        } else if (style === 'stroke') {
          this._ctx.closePath();
          this._ctx.stroke();
        }

        this._ctx.restore(); // Restore the state
      }
    }
  }

  _isHorizontal() {
    return this.props.direction === 'left' || this.props.direction === 'right';
  }
}

function rand(value: number): number {
  return Math.random() * value - value / 2;
}

function isFunc(value: any): boolean {
  return typeof value === 'function';
}

const Particles = styled.div`
  position: relative;
  display: inline-block;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  overflow: hidden;
`;

const Content = styled.div`
  &:focus,
  & > *:focus {
    outline: none;
  }
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  pointer-events: none;
`;
