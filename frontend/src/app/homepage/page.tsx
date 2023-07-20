import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../crsa.png';

export default function Homepage() {
  const progressionData = [
    { number: '1', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { number: '2', text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { number: '3', text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.' },
    { number: '✓', text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.' },
  ];

  return (
    <main className="min-h-screen bg-[#858585]">
      <div className="flex justify-between p-5 bg-[#575757]">
        <div className="text-lg text-white">
          <Image width={100} src={logo} alt='Logo'/>
        </div>
        <div className="mt-3 space-x-4">
        <Link href="/">
          <button className="text-white  py-2 px-4 ">
            Home
          </button>
          </Link>
          <Link href="/userInput">
            <button className=" text-white  py-2 px-4 ">
              Test it
            </button>
          </Link>
          <Link href="/dashboard">
            <button className=" text-white  py-2 px-4 ">
              Dashboard
            </button>
          </Link>
        </div>
      </div>
      <div className="h-[70vh] flex flex-col justify-center pl-[200px] m-10 rounded ">
        <h1 className="text-8xl mb-10 text-white">
          CRSA Tool
        </h1>
        <Link href="/userInput">
        <button className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white  py-2 px-4 rounded">
          Test it!
        </button>
        </Link>
      </div>
      <div className='bg-[#bfbfbf] p-5 h-[100vh]'>
        <div>
          <h1 className='text-4xl border-b-black border-b-2 pb-4 w-[600px] m-5'>What is CRSA?</h1>
          <div className='flex flex-col items-center space-y-4'>
            <p className='pr-5 pl-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            <button className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded">
              Link to GitHub
            </button>
          </div>
        </div>
        <div>
          <h1 className='text-4xl border-b-black border-b-2 pb-4 w-[600px] m-5'>How it works</h1>
          <div className="flex justify-center items-start space-x-10">
            {progressionData.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center w-[200px]">
                  <div className="w-16 h-16 flex justify-center items-center border-2 border-black rounded-full text-2xl mb-4">
                    {item.number}
                  </div>
                  <div className="w-52 p-4 border-2 h-52 border-black">
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
