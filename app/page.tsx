'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer'
import Dropdown, { genreType } from '../components/Dropdown';

export default function Home() {
  const [genre, setGenre] = useState<genreType>('drama');
  return (
    <main className="">
      <Header/>
      <Dropdown genre={genre} setGenre={(newGenre) => setGenre(newGenre)} />
      <Footer/>
    </main>
  )
}
