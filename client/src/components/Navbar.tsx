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
    <nav className="fixed top-0 left-0 right-0 w-full m-4 bg-opacity-80 text-white backdrop-blur-md shadow-md z-50">
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

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white z-50 left-7"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden w-dvh h-lvh absolute top-[60px] justify-center  left-10 mt-4 bg-black/50 bg-opacity-30 backdrop-blur-6xl rounded-4xl pl-15 flex flex-col gap-5 transition-all duration-300 shadow-lg ">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`text-2xl  font-bold transition-all duration-300  ${pathname === href ? 'text-white-500' : 'text-orange-300'
                }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

    </nav>
  );
};

export default Navbar;
