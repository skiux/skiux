import { motion, useReducedMotion } from 'framer-motion';
import { createElement, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  mode?: 'block' | 'words' | 'chars';
  whileInView?: boolean;
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
};

const variants = {
  hidden: { y: '110%' },
  visible: { y: '0%' },
};

export default function MaskReveal({
  children,
  delay = 0,
  duration = 0.9,
  className,
  mode = 'block',
  whileInView = true,
  as = 'div',
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(as, { className }, children);
  }

  if (mode === 'block') {
    return createElement(
      as,
      {
        className,
        style: { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' },
      },
      <motion.span
        style={{ display: 'inline-block', willChange: 'transform' }}
        variants={variants}
        initial="hidden"
        whileInView={whileInView ? 'visible' : undefined}
        animate={whileInView ? undefined : 'visible'}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    );
  }

  const text = typeof children === 'string' ? children : '';
  const parts = mode === 'words' ? text.split(/(\s+)/) : Array.from(text);

  const inner = parts.map((part, i) => {
    if (part.match(/^\s+$/)) return <span key={i}>{part}</span>;
    return (
      <span
        key={i}
        style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
      >
        <motion.span
          style={{ display: 'inline-block', willChange: 'transform' }}
          variants={variants}
          initial="hidden"
          whileInView={whileInView ? 'visible' : undefined}
          animate={whileInView ? undefined : 'visible'}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{
            duration,
            delay: delay + i * (mode === 'chars' ? 0.04 : 0.06),
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {part}
        </motion.span>
      </span>
    );
  });

  return createElement(as, { className }, inner);
}
