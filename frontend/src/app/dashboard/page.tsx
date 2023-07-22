"use client"
import { useState, useEffect } from 'react';
import BubbleChart from '../components/bubbleChart';
import Link from 'next/link';
import logo from '../../../images/crsa.png';
import Image from 'next/image';

interface Row {
  id: number;
  text: string;
  topic: string;
  attitude: number;
  attitudeScore: number;
}

export default function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [topicsData, setTopicsData] = useState<any>();
  const [selectedTopic, setSelectedTopic] = useState('none');
  const [filteredRows, setFilteredRows] = useState(rows);

  const loadingScreen = 
    <div className='w-[100vw] h-[89vh] mx-0 my-0 px-0 text-center text-white' style={{backgroundColor: "rgb(0,0,0, 0.8)", position: "absolute"}}>
        <h1 className="h1-shadow py-50">
          Loading data... <br/>
          Performing topic analysis...
        </h1>
    </div>
  
  const noDataNotification = 
    <div className='text-center text-2xl'>
      <h1>Found no data to process...</h1>
    </div>

  const [loadingState, setLoadingState] = useState(loadingScreen);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoadingState(loadingScreen)
        const resNumberOfMessages = await fetch(`http://localhost:8080/getNumberOfMessages`);
        if (resNumberOfMessages.ok) {
          const numberOfMessages = await resNumberOfMessages.json();
          if (numberOfMessages === 0) {
            setLoadingState(<></>);
            return;
          }

          const numberOfTopics = Math.round((numberOfMessages/4) + 1);

          const response = await fetch(`http://localhost:8080/getMessagesWithTopicModelling?number=`+numberOfTopics.toString());
          if (response.ok) {
            const data = await response.json();
            let flattenedData: any = [];
  
            Object.values(data).forEach((value: any) => {
              flattenedData = [...flattenedData, ...value];
            });
  
            const formattedData = flattenedData.map((message: any, id: Number) => ({
              id: id,
              text: message.message,
              topic: message.topic,
              attitude: Number(message.attitude),
              attitudeScore: Number(message.attitudeScore)
            }));
  
            // Initialize an object to store the count of each topic
            const topicCount: { [topic: string]: number } = {};
            const topicAttitude: { [topic: string]: number } = {};
            const topicAttitudeScore: { [topic: string]: number } = {};
            // Iterate through the flattenedData to extract and count the topics
            flattenedData.forEach((message: any) => {
              if (message.topic in topicCount) {
                topicCount[message.topic]++;
                topicAttitude[message.topic] += Number(message.attitude);
                topicAttitudeScore[message.topic] += Number(message.attitudeScore);
              } else {
                topicCount[message.topic] = 1;
                topicAttitude[message.topic] = Number(message.attitude);
                topicAttitudeScore[message.topic] = Number(message.attitudeScore);
              }
            });
  
            const topicsData = Object.entries(topicCount);
            let combinedData = topicsData.map(([topic, count]) => [topic, count, topicAttitude[topic]]);
            // Set the states
            setRows(formattedData);
            setTopicsData(combinedData);
            
            setLoadingState(<></>)
          }
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    getMessages();
  }, []);

  useEffect(() => {
    if (selectedTopic === 'none') {
      setFilteredRows(rows);
    } else {
      setFilteredRows(rows.filter(row => row.topic === selectedTopic));
    }
  }, [selectedTopic, rows]);


  const handleTopicChange = (e: any) => {
    setSelectedTopic(e.target.value);
  };

  const handleDeleteRow = (id: number) => {
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  const handleAZsort = () => {
    const sortedRows = [...filteredRows].sort((a, b) => a.text.localeCompare(b.text));
    setFilteredRows(sortedRows);
  }

  const downloadData = async () => {
    try {
      const response = await fetch('http://localhost:8080/getMessages');
      const data = await response.json();
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'application/json' });
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = 'messages.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  const showAttitudeAsText = (value: number) => {
    let attitude = '';
    let attitudeColor = "bg-yellow-200";
    switch (value) {
      case -1:
        attitude = "Negative";
        attitudeColor = "bg-red-100";
        break;
      case 0:
        attitude = "Neutral";
        break;
      case 1:
        attitude = "Positive";
        attitudeColor = "bg-green-100";
        break;
    }
    return <span className={attitudeColor}>{attitude}</span>
  }

  return (
    <main className="min-h-screen" style={{overflowX: "hidden"}}>
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

      {loadingState}
      <h1 className='text-4xl border-b-black border-b-2 ml-4 mb-10 p-4 w-[600px]'>Results from Analyzer</h1>
      {(rows.length === 0) ? 
        noDataNotification
      :
      <div id="dashboard-analysis-content">
        <div className="flex flex-col items-center justify-center p-4">
          <BubbleChart data={topicsData} width={1000} height={500}/>
        </div>
        <div className='text-center'>
          <span className='mx-2'><i>Number of messages processed: {rows.length} </i></span>
          <span className='mx-2'><i>Total number of topics: {topicsData.length} </i></span>
        </div>
        <div className="mt-10 mb-2 p-4 bag-grey-200 rounded w-100 flex justify-center">
          <div className='w-[80vw] flex'>
            <label htmlFor="topic" className="mr-2 mt-2">Topic:</label>
            <select id="topic" value={selectedTopic} onChange={handleTopicChange} className="mr-4 p-1">
              <option value="none">Select topic...</option>
              {topicsData && topicsData.map((topic: string, i: number) => (
                <option key={i} value={topic[0]}>{topic[0]}</option>
              ))}
            </select>
            <button onClick={handleAZsort} className="ml-auto bg-black w-fit hover:bg-gray-800 text-white py-2 px-4 rounded">Sort: A-Z</button>   
          </div>
        </div>
        <div className="mt-2 w-100 flex justify-center">
          <div className='h-[600px] overflow-y-scroll overflow-x-hidden'>
            <table className='w-fit' style={{borderCollapse: "separate", borderSpacing: "0 15px"}}>
              <tbody>
                {filteredRows.map(row => (
                  <tr key={row.id} className='bg-white mb-2 shadow-sm rounded'>
                    <td className="w-[40vw] p-2">
                      <div className='text-xs text-gray-500'> Text </div>
                      {row.text}
                    </td>
                    <td className="w-[20vw] p-2">
                      <div className='text-xs text-gray-500'> Associated Topic </div>
                      {row.topic}
                    </td>
                    <td className="w-[10vw] p-2"> 
                      <div className='text-xs text-gray-500'> Sentiment Value </div>
                      {showAttitudeAsText(row.attitude)}
                    </td>
                    <td className="w-[10vw] p-2"> 
                      <div className='text-xs text-gray-500'> Sentiment Score </div>
                      {(row.attitudeScore * 100).toFixed(2)} %
                    </td>
                    <td className="p-3 w-8 text-center align-middle">
                      <button onClick={() => handleDeleteRow(row.id)} className='bg-gray-100 py-2 px-3 rounded hover:bg-gray-300'>x</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              
            </table>
          </div>
        </div>
        <div className='mt-10 mb-20 w-100 mx-auto text-center'>
          <button className="underline text-blue" onClick={downloadData}>
            Download all results
          </button>
        </div>
      </div>
    }
      
    </main>
  )
}
