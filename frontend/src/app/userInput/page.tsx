"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import Image from 'next/image';
import logo from '../../../images/crsa.png';

export default function UserInput() {
  const [notificationMsg, setNotificationMsg] = useState(<></>)
  const [message, setMessage] = useState("")
  const [id, setId] = useState<Number>();
  const inputFile = useRef<HTMLInputElement>(null);
  const content : String | null = null;
  const [fileContent, setFileContent] = useState(content);

  useEffect(() => {
    setId(Math.floor(Math.random() * 9999) + 1);
  }, []);

  const sendMessage = async () => {
    if (message.trim() == ""){
      setNotificationMsg(
        <>
          No messages detected.
        </>
      );
      return;
    }

    try {
      setNotificationMsg(
        <>
          Received message. Analyzing...
        </>
      );
      const response = await fetch('http://localhost:8080/saveMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, message }),
      });
      let attitude = "";
      let attitudeScore = 0;
      let markColour = "bg-yellow-200";
      if (response.ok) {
        const data = await response.json();
        switch (Number(data.attitude)) {
          case -1:
            attitude = "Negative";
            markColour = "bg-red-100";
            break;
          case 0:
            attitude = "Neutral";
            markColour = "bg-yellow-200";
            break;
          case 1:
            attitude = "Positive";
            markColour = "bg-green-100";
            break;
        }
        attitudeScore = Number(data.attitudeScore);

        setNotificationMsg(
          <>
            Your message is <b className={markColour}>{attitude}</b> with {(attitudeScore*100).toFixed(2)}% certainty!
          </>);
      }

    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFileUpload = async (event: any) => {
    const files = event.target.files;

    if (files.length === 0) {
      console.log('No file selected');
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      setFileContent(event.target.result);

    };

    reader.readAsText(file);
  };

  useEffect(() => {
    const sentencesAnalysis = async () => {
      const content = (fileContent !== null)? fileContent : "";
      if (content.length > 0) {
        let temp = content.split('§')
        for (let i = 0; i < temp.length; i++) {
          try {
            let message = temp[i];
            setNotificationMsg(
            <>
              Analyzing file contents... {Math.round(i/temp.length * 100)} % <br/>
              <span className="text-sm">
                Processing message: {message}
              </span>
            </>);
            await new Promise(r => setTimeout(r, 1000)); // Introduce delay
            const response = await fetch('http://localhost:8080/saveMessage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id, message }),
            });

          } catch (error) {
            console.error('An error occurred:', error);
          }
        }
        setNotificationMsg(
          <>All sentences have been analyzed. Navigate to <a href="/dashboard" className="text-blue">dashboard</a> to view the results</>
        );
      }
    }

    sentencesAnalysis();
  }, [id, fileContent]);


  const onButtonClick = () => {
    if (inputFile.current)
      inputFile.current.click();
  };

  return (
    <main className="min-h-screen">
      <div className="flex justify-between p-5 bg-[#575757]">
        <div className="text-lg text-white">
          <Image width={100} src={logo} alt='Logo' />
        </div>
        <div className="mt-3 space-x-4">
          <Link href="/">
            <button className=" text-white  py-2 px-4 ">
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
      <h1 className='text-4xl border-b-black border-b-2 ml-4 p-4 w-[600px]'>Test it!</h1>
      <div className="ml-4 mt-20 text-center justify-center">
        <div className="text-xl w-100">
          <span className="text-start">
            Write a message or upload a file to analyze multiple messages:
          </span>
        </div>
        <div className="mt-5">
          <textarea onChange={e => setMessage(e.target.value)} className="mb-4 p-2 w-[800px] h-[350px] border-2 border-black rounded" data-testid="user-input-textarea"/>
        </div>
        <div>
          <button onClick={onButtonClick} className="text-blue hover:bg-grey-100 ms-2 me-4 ">
              Upload File
          </button>
          <input type="file" ref={inputFile} style={{ display: 'none' }} onChange={handleFileUpload} />
          <button onClick={sendMessage} className="bg-black w-fit hover:bg-gray-800 text-white py-2 px-4 rounded ml-4 text-2xl" data-testid="user-input-analyze-btn">
            Analyze
          </button>
        </div>
        <div className="text-2xl mt-5" data-testid="user-input-notification-msg">
          {notificationMsg}
        </div>
      </div>
    </main>
  )
}
