'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import IntroCard from '@/components/IntroCard'
import Work from '@/components/Work'
import Contact from '@/components/Contact'
import Cursor from '@/components/Cursor'
import StampFlight from '@/components/StampFlight'
import { startScroll, ScrollTrigger } from '@/components/scroll'

export default function Home() {
  useEffect(() => {
    startScroll()
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [])

  return (
    <main>
      <Cursor />
      <Navbar />
      <IntroCard />
      <Work />
      <Contact />
      <StampFlight />
    </main>
  )
}
