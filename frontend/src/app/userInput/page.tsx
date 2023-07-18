"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function UserInput() {
  const [isMsgVisible, setIsMsgVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [id, setId] = useState<Number>();

  useEffect(() => {
    setId(Math.floor(Math.random() * 9999) + 1);
  }, []);

  const sendMessage = async () => {
    try {
      const response = await fetch('http://localhost:8080/saveMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, message }),
      });

      if (response.ok) {
        setIsMsgVisible(true);
      }

    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  return (
    <div className="min-h-screen bg-[#858585]">
      <div className="flex justify-between p-5 bg-[#575757]">
        <div className="text-lg text-white">
          Logo
        </div>
        <div className="space-x-4">
          <Link href="/">
            <button className=" text-white  py-2 px-4 ">
              Home
            </button>
          </Link>
          <Link href="/userInput">
            <button className=" text-white  py-2 px-4 ">
              Test it
            </button>
          </Link>
        </div>
      </div>
      <h1 className='text-4xl border-b-black border-b-2 ml-4 p-4 w-[600px]'>Test it!</h1>
      <div className="flex flex-row justify-center">
        <h2 className="text-2xl mt-40 mr-24">Write a message: </h2>
        <div className="flex flex-col mt-40">
          <textarea onChange={e => setMessage(e.target.value)} className="mb-4 p-2 bg-[#858585] w-[500px] h-[250px] border-2 border-black" />
          <div className="flex justify-end">
            {isMsgVisible && <p id="msgSent">Message has been sent</p>}
            <button onClick={sendMessage} className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded ml-4">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
