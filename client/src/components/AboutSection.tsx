'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AboutSectionProps {
  title: string;
  content: React.ReactNode;
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, content, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -100px 0px' });

  return (
    <motion.section
      ref={ref}
      className={`mb-10 ${className ?? ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-300">{title}</h2>
      <div className="text-white text-base md:text-lg">{content}</div>
    </motion.section>
  );
};

export default AboutSection;
