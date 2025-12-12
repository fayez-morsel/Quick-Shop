import { motion, type HTMLMotionProps, type TargetAndTransition } from "framer-motion";
import { useMemo } from "react";
import clsx from "clsx";
import { sectionVariants } from "../animations/variants";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

type MotionSectionProps = HTMLMotionProps<"section"> & {
  staggerChildren?: number;
};

export default function MotionSection({
  className,
  staggerChildren = 0.15,
  children,
  ...rest
}: MotionSectionProps) {
  const { ref, controls } = useScrollAnimation();

  const variants = useMemo(
    () => {
      const visible = sectionVariants.visible as TargetAndTransition;
      return {
        ...sectionVariants,
        visible: {
          ...visible,
          transition: {
            ...(visible.transition ?? {}),
            staggerChildren,
          },
        },
      };
    },
    [staggerChildren]
  );

  return (
    <motion.section
      ref={ref}
      className={clsx("will-change-transform", className)}
      initial="hidden"
      animate={controls}
      variants={variants}
      {...rest}
    >
      {children}
    </motion.section>
  );
}
