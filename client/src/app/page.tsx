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
          backgroundColor: 0x1a1a2e,
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
        <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center text-white text-center px-4 gap-6">
          <img
            src="/profile.jpeg"
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover shadow-lg border-2 border-white"
          />

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-poppins">
            <span className="text-orange-300 transition-all duration-500 ease-in-out">{greetings[index]}</span>, I'm Khushi Rathore
          </h1>

          <p className="text-sm sm:text-base md:text-lg mt-2 max-w-2xl px-4 text-white/90">
            MCA'26 student at Banasthali. A dreamer in code, a thinker in logic, and a builder in soul — forging paths in Full Stack Development.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
            <button
              onClick={() => router.push('/about')}
              className="px-5 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-sm sm:text-base"
            >
              About
            </button>
            <button
              onClick={() => router.push('/Education')}
              className="px-5 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-sm sm:text-base"
            >
              Edu / Exp
            </button>
            <button
              onClick={() => router.push('/Projects')}
              className="px-5 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-sm sm:text-base"
            >
              My Work
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="px-5 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 transition duration-300 text-sm sm:text-base"
            >
              Let's Connect
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
