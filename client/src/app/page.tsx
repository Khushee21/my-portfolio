'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import "three";
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export default function Home() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const router = useRouter();

  const greetings = ['Heyyaa', 'Hola', 'Bonjour', 'नमस्ते', 'Ciao'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!vantaEffect && typeof window !== 'undefined' && window.VANTA && window.THREE) {
      setVantaEffect(
        window.VANTA.BIRDS({
          el: vantaRef.current,
          THREE: window.THREE,
          backgroundColor: 0x000000,
          color1: 0xff4500,
          color2: 0xff69b4,
          birdSize: 0.6,
          wingSpan: 10.0,
          speedLimit: 3.0,
          separation: 80.0,
          quantity: 3.0,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white">

      <motion.div
        ref={vantaRef}
        className="relative h-screen w-screen transition-all duration-1000"
      >
        <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center text-white text-center px-4 gap-4 sm:gap-6">
          <div className="absolute bottom-0 right-0 blob w-[30vw] h-[40vh] sm:w-[25vw] sm:h-[35vh] md:w-[40vw] md:h-[60vh] opacity-30 blur-xl z-0 pointer-events-none" />
          <div className="absolute top-0 left-0 blob w-[30vw] h-[40vh] sm:w-[25vw] sm:h-[35vh] md:w-[20vw] md:h-[30vh] opacity-50 blur-xl z-0 pointer-events-none" />
          <motion.img
            src="/profile.jpeg"
            alt="Khushi Rathore - Full Stack Developer"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full object-cover shadow-lg border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Main Heading */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-poppins px-2">
            <span className="text-orange-300 transition-all duration-500 ease-in-out">
              {greetings[index]}
            </span>
            , I'm Khushi Rathore
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl px-2 sm:px-4 text-white/90 leading-relaxed">
            MCA'26 student at Banasthali. A dreamer in code, a thinker in logic, and a builder in soul — forging paths in Full Stack Development.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 px-2">
            <button
              onClick={() => router.push('/about')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full text-orange-300 bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-xs sm:text-sm md:text-base"
            >
              About
            </button>
            <button
              onClick={() => router.push('/Education')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-xs sm:text-sm md:text-base"
            >
              Edu / Exp
            </button>
            <button
              onClick={() => router.push('/Projects')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full text-orange-300 bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-xs sm:text-sm md:text-base"
            >
              My Work
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-xs sm:text-sm md:text-base"
            >
              Let's Connect
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}