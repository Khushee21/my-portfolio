'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete(); 
          }, 1000);
        }
        return old + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="h-screen w-screen bg-black/30 text-white relative"
      initial={{ y: 0 }}
      animate={{ y: -progress / 100 * 900 }}
      transition={{ type: 'tween', duration: 0.2 }}
    >
      {/* Bottom bar with progress and text */}
      <div className="absolute bottom-6 left-0 right-0 px-8 mx-2 flex justify-between items-center">
        <motion.p
          className="text-5xl font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {progress}%
        </motion.p>

        <motion.p
          className="text-4xl font-bold text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Currently working as SDE at Newral
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Loader;
