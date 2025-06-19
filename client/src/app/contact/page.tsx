'use client';

import { Mail, Github, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Chatbot from '@/app/Chatbot/page';

const Contact = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-[#0F0F0F] text-white px-4 sm:px-6 py-10 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Chatbot />
        <Navbar />

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 mt-14 text-orange-300 tracking-wide text-center">
          Get in Touch
        </h2>

        <p className="text-gray-400 text-center max-w-2xl text-lg sm:text-xl md:text-2xl px-2">
          Let’s create something mesmerizing together
        </p>

        <p className="text-gray-400 text-center max-w-xl text-sm sm:text-base mb-8 mt-2 px-2">
          I’ll get back to you as soon as possible!
        </p>

        <Image
          src="/contact.png"
          alt="Contact"
          width={280}
          height={280}
          className="mb-8 rounded-xl shadow-xl object-contain"
        />

        <form
          action="https://formspree.io/f/xzzggroo"
          method="POST"
          className="w-full max-w-lg sm:max-w-xl space-y-6 bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl shadow-lg border border-orange-400/30 backdrop-blur-md"
        >
          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-orange-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 rounded-lg bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-orange-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-orange-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-3 rounded-lg bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-orange-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-orange-300">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              required
              className="w-full p-3 rounded-lg bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-orange-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold tracking-wide text-orange-300">
              Message
            </label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full p-3 rounded-lg bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-orange-300"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-300 hover:bg-gradient-to-r  hover:to-orange-400 text-black px-6 py-3 rounded-full font-bold shadow-md transition transform hover:scale-105 w-full sm:w-auto"
          >
            Send Message <Send size={18} />
          </button>
        </form>

        <Footer />
      </motion.div>
    </>
  );
};

export default Contact;
