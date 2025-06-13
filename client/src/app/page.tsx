'use client';

import { useEffect, useRef, useState } from 'react';
import Loader from '@/components/Loader';
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
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const router=useRouter();
  const greetings = ['Heyyaa', 'Hola', 'Bonjour', 'नमस्ते', 'Ciao'];
  const [index, setIndex] = useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setIndex((prev) => (prev+1)% greetings.length);
    }, 2000);
    return ()=> clearInterval(interval);
  },[]);

  useEffect(() => {
    if (
      loadingComplete &&                  // ← Wait for loader to finish
      !vantaEffect &&
      typeof window !== 'undefined' &&
      window.VANTA &&
      window.THREE
    ) {
//       setVantaEffect(
//   window.VANTA.FOG({
//     el: vantaRef.current,
//     THREE: window.THREE,
//   highlightColor: 0x87CEEB,   // LightSkyBlue
//   midtoneColor: 0x4682B4,     // SteelBlue
//   lowlightColor: 0x1E3A5F,    // Deep bluish shade
//   baseColor: 0x0F172A,        // Very dark navy (for base)
//   blurFactor: 0.5,
//   speed: 0.6,
//   zoom: 1.2
//   })
// );
setVantaEffect(
  window.VANTA.BIRDS({
    el: vantaRef.current,
    THREE: window.THREE,
    backgroundColor: 0x1a1a2e, // Dark navy background
    color1: 0xff4500,          // OrangeRed
    color2: 0xff69b4,          // Pink
    birdSize: 0.6,             // Slightly larger birds
    wingSpan: 10.0,            // Wider wings
    speedLimit: 3.0,           // Moderate speed
    separation: 80.0,          // Medium spacing
    quantity: 3.0, 
  })
);

    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [loadingComplete, vantaEffect]);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white">
      {/* Loader Component */}
      {!loadingComplete && (
        <Loader onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Vanta Background Section (now waits for loader) */}
      <motion.div
        ref={vantaRef}
        className={`relative h-screen w-screen transition-all duration-1000 ${
          loadingComplete ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      >
        {/* Foreground Content */}
        <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center text-white text-center px-4 gap-6">
          <img
              src="/profile.jpeg"
              alt="Profile"
               className="w-36 h-36 rounded-full object-cover shadow-lg border-2 border-white"
         /> 
          <h1 className="text-4xl md:text-5xl font-bold font-poppins"><span className="text-orange-300 transition-all duration-500 ease-in-out">{greetings[index]}</span>, I'm Khushi Rathore </h1>
          <p className="text-base md:text-lg mt-2 max-w-2xl px-4">
              MCA'26 student at Banasthali. A dreamer in code, a thinker in logic, and a builder in soul — forging paths in Full Stack Development.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button
    onClick={() => router.push('/about')}
    className="px-6 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 hover:text-white transition duration-300"
  >
    About
  </button>
  <button
    onClick={() => router.push('/education')}
    className="px-6 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 hover:text-white transition duration-300"
  >
    Edu / Exp
  </button>
  <button
    onClick={() => router.push('/projects')}
    className="px-6 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 hover:text-white transition duration-300"
  >
    My Work
  </button>
  <button
    onClick={() => router.push('/contact')}
    className="px-6 py-2 rounded-full text-white bg-transparent border border-zinc-50 font-semibold shadow-md hover:bg-white/15 hover:text-white transition duration-300"
  >
    Let's Connect
  </button>
</div>

        </div>
      </motion.div>
    </div>
  );
}
