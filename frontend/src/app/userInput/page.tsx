"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from 'next/image';
import logo from '../../../crsa.png';

export default function UserInput() {
  const [notificationMsg, setNotificationMsg] = useState('')
  const [message, setMessage] = useState("")
  const [id, setId] = useState<Number>();
  const [attitude, setAttitude] = useState("");

  useEffect(() => {
    setId(Math.floor(Math.random() * 9999) + 1);
  }, []);

  const sendMessage = async () => {
    try {
      setNotificationMsg("Your messages is sent. Analyzing...");
      const response = await fetch('http://localhost:8080/saveMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, message }),
      });
      let attitude = "";
      if (response.ok) {
        const data = await response.json();
        switch (Number(data.attitude)) {
          case -1: 
            attitude = "Negative";
            break;
          case 0: 
            attitude = "Neutral";
            break;
          case 1: 
            attitude = "Positive";
            break;
        }

        setNotificationMsg("Your message is " + attitude);
      }
  
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  


  return (
    <div className="min-h-screen bg-[#858585]">
      <div className="flex justify-between p-5 bg-[#575757]">
        <div className="text-lg text-white">
        <Image width={100} src={logo} alt='Logo'/>
        </div>
        <div className="mt-3 space-x-4">
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
          <Link href="/dashboard">
            <button className=" text-white  py-2 px-4 ">
              Dashboard
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
            <p id="msgSent">{notificationMsg}</p>
            <button onClick={sendMessage} className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded ml-4">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
