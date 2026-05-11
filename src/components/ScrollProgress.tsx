import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const y = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleY: y, transformOrigin: 'top' }}
      className="fixed right-0 top-0 z-50 h-screen w-px bg-charcoal/80"
    />
  );
}
