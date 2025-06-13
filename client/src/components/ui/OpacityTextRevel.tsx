import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HTMLAttributes } from 'react';

gsap.registerPlugin(ScrollTrigger);

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

export const OpacityTextReveal = ({
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => {
  const textRef = useRef(null);

  useGSAP(() => {
    gsap.to(textRef.current, {
      backgroundPositionX: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: textRef.current,
        scrub: 1,
        start: 'top bottom',
        end: 'bottom center',
      },
    });
  }, []);

  return (
    <span
      {...props}
      ref={textRef}
      className={cn('text-reveal', props.className)}
    >
      {children}
    </span>
  );
};
