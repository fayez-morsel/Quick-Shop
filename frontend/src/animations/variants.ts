import type { Variants } from "framer-motion";

export const easeOutCubic = [0.33, 1, 0.68, 1] as const;

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeOutCubic,
      staggerChildren: 0.15,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOutCubic },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easeOutCubic,
      delay: index * 0.08,
    },
  }),
};

export const imageVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: easeOutCubic, delay: 0.05 },
  },
};

export const staggerList: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};
