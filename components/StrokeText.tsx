import React, { useEffect, useRef, useState, useId } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface StrokeTextProps {
  text?: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number | string;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: 'mount' | 'hover' | 'scroll' | 'loop';
  fillMode?: 'none' | 'wipe' | 'fade';
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  reverse?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export default function StrokeText({
  text = 'Draw Attention',
  strokeColor = '#A78BFA',
  fillColor = '#F8FAFC',
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = 'power2.out',
  trigger = 'mount',
  fillMode = 'wipe',
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  reverse = false,
  align = 'left',
  className = '',
  style = {}
}: StrokeTextProps) {
  const wipeId = useId().replace(/:/g, '');

  const preserveAspectRatio = align === 'left' ? 'xMinYMid meet' : align === 'right' ? 'xMaxYMid meet' : 'xMidYMid meet';

  const rootRef = useRef<HTMLSpanElement>(null);
  const strokeTextRef = useRef<SVGTextElement>(null);
  const wipeRectRef = useRef<SVGRectElement>(null);

  const [box, setBox] = useState<{ x: number, y: number, width: number, height: number, emWidth: number, emHeight: number } | null>(null);

  const textString = String(text ?? '');
  const lines = textString.split('\n');
  const dash = fontSize ? Math.max(fontSize * 7, 200) : 2000;

  const fontStyle = {
    ...(fontFamily !== undefined && { fontFamily }),
    ...(fontSize !== undefined && { fontSize: `${fontSize}px` }),
    ...(fontWeight !== undefined && { fontWeight }),
    ...(letterSpacing !== undefined && { letterSpacing: `${letterSpacing}px` })
  };

  const viewBox = box
    ? `${box.x} ${box.y} ${box.width} ${box.height}`
    : `0 -100 600 200`;

  const rootClass = `stroke-text ${trigger === 'hover' ? 'stroke-text--hover cursor-pointer' : ''} ${className}`.trim();
  const clipPathAttr = fillMode === 'wipe' && box ? `url(#wipe-${wipeId})` : undefined;

  useEffect(() => {
    let cancelled = false;
    const node = strokeTextRef.current;
    if (!node) return;

    const measure = () => {
      if (cancelled || !strokeTextRef.current) return;
      let bbox;
      try {
        bbox = strokeTextRef.current.getBBox();
      } catch {
        return;
      }
      if (!bbox || !bbox.width) return;
      const computed = window.getComputedStyle(strokeTextRef.current);
      const fs = parseFloat(computed.fontSize) || 16;
      const strokePad = Number(strokeWidth) || 1.4;
      const padX = strokePad * 1.5; 
      const padY = Math.max(strokePad, fs * 0.05);
      const next = {
        x: bbox.x - padX,
        y: bbox.y - padY,
        width: bbox.width + padX * 2,
        height: bbox.height + padY * 2,
        emWidth: (bbox.width + padX * 2) / fs,
        emHeight: (bbox.height + padY * 2) / fs
      };
      
      setBox(prev => {
        if (
          prev &&
          Math.abs(prev.x - next.x) < 0.5 &&
          Math.abs(prev.width - next.width) < 0.5 &&
          Math.abs(prev.y - next.y) < 0.5
        ) {
          return prev;
        }
        return next;
      });
    };

    setTimeout(measure, 50);

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [textString, fontFamily, fontSize, fontWeight, letterSpacing, strokeWidth]);

  useEffect(() => {
    const root = rootRef.current;
    if (typeof window === 'undefined' || !root || !box) return;

    const strokes = gsap.utils.toArray('[data-stroke-char]', root);
    const fills = gsap.utils.toArray('[data-fill-char]', root);
    const wipe = wipeRectRef.current;
    if (!strokes.length) return;

    const fillEnabled = fillMode !== 'none';
    const useWipe = fillEnabled && fillMode === 'wipe';
    const fillDuration = Math.max(0.4, drawDuration * 0.5);
    const staggerConfig = reverse
      ? { each: stagger, from: 'end' as const }
      : stagger;
    const targets = [...strokes, ...fills, wipe].filter(Boolean);

    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      gsap.set(fills, { opacity: useWipe ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: 0 } });
    };

    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
      gsap.set(fills, { opacity: fillEnabled ? 1 : 0 });
      if (wipe) gsap.set(wipe, { attr: { width: fillEnabled ? box.width : 0 } });
    };

    const prefersReducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    
    if (prefersReducedMotion) {
      setEnd();
      return () => { gsap.killTweensOf(targets); };
    }

    const build = () => {
      setStart();
      const tl = gsap.timeline({
        paused: true,
        repeat: trigger === 'loop' ? -1 : 0,
        repeatDelay: trigger === 'loop' ? 0.9 : 0,
        defaults: { overwrite: 'auto' }
      });
      tl.to(
        strokes,
        {
          strokeDashoffset: 0,
          duration: drawDuration,
          ease: ease,
          stagger: staggerConfig
        },
        0
      );
      if (useWipe && wipe) {
        tl.to(
          wipe,
          { attr: { width: box.width }, duration: fillDuration, ease: 'power2.inOut' },
          drawDuration + fillDelay
        );
      } else if (fillEnabled) {
        tl.to(
          fills,
          {
            opacity: 1,
            duration: fillDuration,
            ease: 'power2.out',
            stagger: staggerConfig
          },
          drawDuration + fillDelay
        );
      }
      return tl;
    };

    let timeline: gsap.core.Timeline | null = null;
    let scrollTrigger: ScrollTrigger | null = null;
    let removeHover: (() => void) | null = null;

    if (trigger === 'hover') {
      setEnd();
      const play = () => {
        timeline?.kill();
        timeline = build();
        timeline.play(0);
      };
      root.addEventListener('pointerenter', play);
      removeHover = () => root.removeEventListener('pointerenter', play);
    } else {
      timeline = build();
      if (trigger === 'scroll') {
        scrollTrigger = ScrollTrigger.create({
          trigger: root,
          start: 'top 82%',
          once: true,
          onEnter: () => timeline?.play(0)
        });
      } else {
        timeline.play(0);
      }
    }

    return () => {
      removeHover?.();
      scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf(targets);
    };
  }, [box, dash, drawDuration, fillDelay, stagger, ease, trigger, fillMode, reverse]);

  return (
    <span
      ref={rootRef}
      className={rootClass}
      style={{ ...style, display: 'block', width: '100%', lineHeight: 0 } as React.CSSProperties}
      role="img"
      aria-label={String(text ?? '')}
    >
      <svg
        className="stroke-text__svg"
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        aria-hidden="true"
        style={{ 
          display: 'block', 
          width: box ? `${box.emWidth}em` : '100%', 
          height: box ? `${box.emHeight}em` : 'auto', 
          maxWidth: '100%' 
        }}
      >
        {fillMode === 'wipe' && box && (
          <defs>
            <clipPath id={`wipe-${wipeId}`} clipPathUnits="userSpaceOnUse">
              <rect
                ref={wipeRectRef}
                x={box.x}
                y={box.y}
                width="0"
                height={box.height}
              />
            </clipPath>
          </defs>
        )}

        <text
          ref={strokeTextRef}
          className="stroke-text__stroke"
          x="0"
          y="0"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ ...fontStyle, userSelect: 'none' }}
        >
          {lines.map((line, lineIdx) => (
            <tspan key={`stroke-line-${lineIdx}`} x="0" dy={lineIdx === 0 ? "0" : "0.78em"}>
              {Array.from(line).map((char, charIdx) => (
                <tspan key={`stroke-char-${lineIdx}-${charIdx}`} data-stroke-char>{char}</tspan>
              ))}
            </tspan>
          ))}
        </text>

        <text
          className="stroke-text__fill"
          x="0"
          y="0"
          fill={fillColor}
          stroke="none"
          style={{ ...fontStyle, userSelect: 'none' }}
          clipPath={clipPathAttr}
        >
          {lines.map((line, lineIdx) => (
            <tspan key={`fill-line-${lineIdx}`} x="0" dy={lineIdx === 0 ? "0" : "0.78em"}>
              {Array.from(line).map((char, charIdx) => (
                <tspan key={`fill-char-${lineIdx}-${charIdx}`} data-fill-char>{char}</tspan>
              ))}
            </tspan>
          ))}
        </text>
      </svg>
    </span>
  );
}
