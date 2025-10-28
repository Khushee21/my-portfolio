'use client';

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useState } from "react";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/Education', label: 'Education' },
    { href: '/Projects', label: 'My Work' },
    { href: '/contact', label: 'Connect' },
  ];

  return (
    <nav className="fixed top-2 left-0 rounded-3xl w-[calc(100%-1rem)] mx-2 bg-opacity-80 text-white backdrop-blur-md shadow-md z-50">
      <div className="max-w-screen-lg mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:rounded-full">
        <h1 onClick={() => router.push('/')} className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent tracking-wide">
          🏠︎
        </h1>

        <ul className="hidden md:flex gap-6 md:gap-8 items-center text-base font-medium">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`transition-all duration-300 hover:text-orange-300 ${pathname === href ? 'text-orange-300' : 'text-white'
                  }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-white z-50 left-7"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden  w-4/5 h-lvh absolute top-[60px] right-0 mt-4 backdrop-blur-6xl rounded-l-4xl flex flex-col gap-5 transition-all duration-300 shadow-lg overflow-hidden border-l-3 border-black">
          <div className="absolute inset-0 bg-orange-300 opacity-80 z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`text-3xl font-bold transition-all duration-300 hover:scale-110 hover:text-orange-300 ${pathname === href ? 'text-white underline' : 'text-black'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
