import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../images/crsa.png';

export default function Homepage() {
  const progressionData = [
    { number: '1', text: 'Access the tool by clicking “Start the analysis” or by navigating to the "Analyzer" tab'},
    { number: '2', text: 'Upload a txt file containing text responses you have collected from your customers as feedback' },
    { number: '3', text: 'Press the “Analyze” button '},
    { number: '✓', text: 'View the summary dashboard that is generated or drill-down on individual topics and messages' },
  ];

  return (
    <main className="min-h-screen">
      <div className="flex justify-between p-5 bg-[#575757]">
        <div className="text-lg text-white">
          <Image width={100} src={logo} alt='Logo' />
        </div>
        <div className="mt-3 space-x-4">
          <Link href="/">
            <button className="text-white  py-2 px-4 ">
              Home
            </button>
          </Link>
          <Link href="/userInput">
            <button className=" text-white  py-2 px-4 ">
              Analyzer
            </button>
          </Link>
          <Link href="/dashboard">
            <button className=" text-white  py-2 px-4 ">
              Dashboard
            </button>
          </Link>
        </div>
      </div>
      <div className="h-[70vh] flex flex-col justify-center pl-10 hero">
        <h1 className="text-6xl mb-10 text-white mx-auto h1-shadow">
          Customer Response Sentiment Analyzer
        </h1>
        <Link href="/userInput" className='mx-auto'>
          <button className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded ">
            Start the analysis
          </button>
        </Link>
      </div>
      <div className=' p-5 h-[100vh]'>
        <div>
          <h1 className='text-4xl border-b-black border-b-2 pb-4 w-[600px] m-5 mt-20'>What is CRSA?</h1>
          <div className='flex flex-col items-center space-y-4'>
            <p className='pr-5 pl-5'>
              The CRSA tool is a software allowing you to extract meaningful information from the feedback you collect from your customers. See what your customers are talking about and what they think about the services you offer!   
            </p>
            <div className='pt-10'>
              <a href="https://github.com/ConteDeStGermain/csi3140-GP" target="_blank" rel="noopener noreferrer">
                <button className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded">
                  Link to GitHub
                </button>
              </a>
            </div>
          </div>
        </div>
        <div>
          <h1 className='text-4xl border-b-black border-b-2 pb-4 w-[600px] m-5 mt-20'>How it works</h1>
          <div className="flex justify-center items-start space-x-10 mt-10">
            {progressionData.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center w-[200px]">
                  <div className="w-16 h-16 flex justify-center items-center rounded-full text-2xl mb-4 bg-gray-400">
                    {item.number}
                  </div>
                  <div className="w-52 p-4 border-1 h-52 border-black text-center">
                    {item.text}
                  </div>
                </div>
                {index < progressionData.length - 1 && (
                  <div className="flex items-center justify-center">
                    <svg className="h-6 w-16  fill-current text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20">
                      <path d="m 1 15 h 34 v 2 H 1 v 0 z m 36 6 l 5 -5 l -7 -6 v 13 z z" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
