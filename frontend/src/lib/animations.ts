export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
};

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
};

export const pageTransition = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  enter: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

export const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }
};

export const slideDown = {
  hidden: { height: 0, opacity: 0 },
  show: { height: 'auto', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};
