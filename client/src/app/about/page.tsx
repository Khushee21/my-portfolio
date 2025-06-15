'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AboutSection from '@/components/AboutSection';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Chatbot from '@/app/Chatbot/page';


export default function AboutPage() {
  const [showFirstImage, setShowFirstImage] = useState(true);
  const router= useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstImage((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='bg-[#0F0F0F]'>
    <motion.div
      className="min-h-screen bg-[#0F0F0F] text-white px-6 py-10 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Navbar />
      <Chatbot/>
     <div className="relative text-center mb-10 mt-10">
  <div className="absolute top-0 right-0 blob w-[50vw] h-[100vh] rounded-full opacity-30 blur-3xl z-0 pointer-events-none"></div>
  
  <p className="italic text-white z-10 relative">
    "A quiet storm with wings, rising on her own terms."
  </p>
</div>

      {/* Sectioned Content */}
      <div className="max-w-5xl mx-auto space-y-12">
        <AboutSection
          title=" Who Am I?"
          content="From getting lost in while loops to confidently solving 600+ DSA problems, I have built myself piece by piece. My goal is to become a skilled Software Development Engineer (SDE) who can create technology that serves real-world needs I specilized in building dynamic, scalable, and seamless web applications.. I am currently pursuing MCA from Banasthali Vidyapith with a CGPA of 9.5. My passion lies in merging creativity with functionality. I’m deeply interested in building scalable web applications and solving complex problems using clean code and effective design systems."
        />
        <button
          onClick={() => router.push('/Projects')}
           className="mt-6 px-6 py-2 bg-gradient-to-r from-orange-300  text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300"
        >
            ➥ Click to see some glimpses of my work...
        </button>
        <h1> ➥ Want to know more about me?</h1>
        <button onClick={()=>router.push('/chatbot')}  className=" px-6 py-2 bg-gradient-to-r from-orange-300  text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300" >
           Connect with my assistent 🤖
        </button>


        <AboutSection
          title="Languages Spoken"
          content={
            <ul>
                <li className='bg-transparent border py-1.5 rounded-full border-zinc-50 px-6 m-2.5 w-fit'>English</li>
                <li className='bg-transparent border py-1.5 rounded-full border-zinc-50 px-8 m-2.5 w-fit'>Hindi</li>
            </ul>
          }
        />

        <AboutSection
  title=" Tech Stack"
  content={
    <ul className="pl-6 space-y-4 list-none">
      <li>
        <strong>Frontend:</strong>
        <div className="flex flex-wrap mt-2 gap-2">
          <span className=" bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">React.js</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Redux Store</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Next.js</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">TypeScript</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Tailwind CSS</span>
        </div>
      </li>
      <li>
        <strong>Backend:</strong>
        <div className="flex flex-wrap mt-2 gap-2">
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Node.js</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Firebase</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">JWT Token</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Express.js</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Socket.IO</span>
        </div>
      </li>
      <li>
        <strong>Database:</strong>
        <div className="flex flex-wrap mt-2 gap-2">
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">MongoDB</span>
        </div>
      </li>
      <li>
        <strong>Tools & Cloud:</strong>
        <div className="flex flex-wrap mt-2 gap-2">
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">GitHub</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Vercel</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Figma</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Postman</span>
        </div>
      </li>
      <li>
        <strong>UI Libraries</strong>
        <div className="flex flex-wrap mt-2 gap-2">
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Shadcn</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Framer Motion</span>
          <span className="bg-transparent border py-1.5 rounded-full border-zinc-50 px-4 w-fit">Chakra ui</span>
        </div>
      </li>
    </ul>
  }
/>

<AboutSection
  title=" Work Experience"
  content={
    <>
    <div className="flex items-center gap-3 mb-2">
         <img src="/newral.webp" alt="Newral Logo" className="h-10 w-auto" />
  <h3 className="text-lg md:text-xl font-semibold">Intern at Newral (May – July 2025):</h3>
</div>

    <ul className="list-disc pl-6 space-y-1">
      <li>Worked on a real-time chat platform (AssumeChat) using Next.js + TypeScript + Nodejs </li>
      <li>Improved UI performance & component reusability</li>
      <li>Experience how production level code works</li>
      <li>Learn </li>
    </ul>
    </>
  }
/>

<AboutSection
  title=" Education"
  content={
    <ul className="list-disc pl-6 space-y-1">
      <li><strong>MCA (2024–2026), Banasthali Vidyapith</strong> — CGPA: 9.5</li>
      <li><strong>BCA (2021–2024), Vikram University</strong></li>
    </ul>
  }
/>

<AboutSection
  title=" Hackathons"
  content={
    <ul className="list-disc pl-6 space-y-1 ">
      <li><strong>Hack Celestia 2025 — Top 10 Finalist</strong></li>
      <li>Built “Hostel Grievance System” using MERN Stack & Socket.IO</li>
      <li>Focused on real-time features, team-based dashboards, and a chatbot , and explore how grievance can fill digtally</li>
      <li>Learned to deliver functional apps under strict deadlines which helps to understand time management</li>
    </ul>
  }
/>
        {/* Image Swapper */}
        <div className="my-8 flex justify-center">
          {showFirstImage ? (
            <motion.img
              src="/h1.png"
              alt="Hackathon Image 1"
              className="w-full max-w-lg rounded-md shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          ) : (
            <motion.img
              src="/h2.png"
              alt="Hackathon Image 2"
              className="w-full max-w-lg rounded-md shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </div>

        <AboutSection
  title=" Why Hire Me?"
  content={
    <ul className="list-disc pl-6 space-y-1">
      <li>Strong foundation in MERN stack and real-time systems</li>
      <li>600+ DSA problems solved — disciplined and persistent</li>
      <li>Design-oriented with a clean, modern UI sense</li>
      <li>Team player, fast learner, and detail-oriented</li>
      <li>Committed to delivering value-driven, real-world software</li>
    </ul>
  }
/>
      </div>
       <section className="text-center  py-25 px-6 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a] text-white">
  <h1 className="text-4xl  md:text-5xl font-extrabold mb-4 text-orange-300">Ready to Work Together?</h1>
  <h3 className="text-lg md:text-xl font-light mb-8">
    Let’s connect and turn bold ideas into impactful digital realities.
  </h3>
  <button
    onClick={() => router.push('/contact')}
    className="mt-6 px-6 py-2 bg-gradient-to-r from-orange-300  text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300"
  >
    Here we go
  </button>
</section>
   <Footer/>
    </motion.div>
    </div>
  );
}
