'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer'
import RecommendationCard from '../components/RecommendationCard';
import Dropdown, { genreType } from '../components/Dropdown';
import { useChat } from 'ai/react';

export default function Home() {
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState<genreType>('drama');
  const recommendation = useRef<null | HTMLDivElement>(null);

  const scrollToRecommendations = () => {
    if (recommendation.current !== null) {
      recommendation.current.scrollIntoView({ behavior: 'smooth' });  
    }
  };

  const { input, handleInputChange, handleSubmit, isLoading, messages } = 
    useChat({
      body: {
        description,
        genre,
      },
      onResponse() {
        scrollToRecommendations();
      },
    });

    const onSubmit = (e: any) => {
      setDescription(input);
      handleSubmit(e);
    };

    const lastMessage = messages[messages.length - 1];
    const generatedRecommendations = lastMessage?.role === "assistant" ? lastMessage.content : null;



  return (
    <main className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Hero/>
      <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <div className="flex mt-10 items-center space-x-3">
            {/* <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            /> */}
            <p className="text-left font-medium">
              describe what would you like to watch!
            </p>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              'e.g. a movie about a group of friends who go on a road trip'
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            {/* <Image src="/2-black.png" width={30} height={30} alt="1 icon" /> */}
            <p className="text-left font-medium">select a genre!</p>
          </div>
          <div className="block">
            <Dropdown genre={genre} setGenre={(newGenre) => setGenre(newGenre)} />
          </div>
          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
            >
              get recommendations &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
              </span>
            </button>
          )}
        </form>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <output className="space-y-10 my-10">
          {generatedRecommendations && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={recommendation}
                >
                  recommendations!
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedRecommendations
                  .substring(generatedRecommendations.indexOf('1') + 3)
                  .split(/\d+\.\s*/)
                  .slice(0,5)
                  .map((generatedRecommendation) => {
                    const [title, description] = generatedRecommendation.split(': ');
                    return { title, description };
                  })
                  .map((recommendation, index) => {
                    return (
                      // <div
                      //   className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition border"
                      //   key={index}
                      // >
                      // <p>
                      //   <strong>{recommendation.title}</strong>: {recommendation.description}
                      // </p>
                      // </div>
                      <RecommendationCard title={recommendation.title} description={recommendation.description} />
                      
                    );
                  })}
              </div>
            </>
          )}
        </output>
      
      <Footer/>
    </main>
  )
}
