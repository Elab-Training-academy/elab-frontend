'use client';
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const BlurText = ({
  text = '',
  className = '',
  delay = 150,
  animateBy = 'words', // "words" or "chars"
  direction = 'top',
  onAnimationComplete = () => {},
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  const items = animateBy === 'chars' ? text.split('') : text.split(' ');

  const yOffset = direction === 'top' ? 20 : -20;

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: delay / 1000,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      onAnimationComplete={onAnimationComplete}
    >
      {items.map((item, i) => (
        <motion.span key={i} variants={itemVariants} className="inline-block mr-1">
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default BlurText;
