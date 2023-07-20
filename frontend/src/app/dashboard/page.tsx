"use client"
import { useState, useEffect } from 'react';
import BubbleChart from '../components/bubbleChart';
import Link from 'next/link';

interface Row {
  id: number;
  text: string;
  topic: string;
}



export default function Dashboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [topicsData, setTopicsData] = useState<any>();
  const [selectedTopic, setSelectedTopic] = useState('none');
  const [filteredRows, setFilteredRows] = useState(rows); 

  useEffect(() => {
    const getTopics = async (number: number) => {
      try {
        const response = await fetch(`http://localhost:8080/getTopics?number=${number}`);
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.topics.map((topic: any, i: Number) => ({
            id: i,
            value: topic[1],
            label: topic[0]
          }));
          setTopicsData(formattedData);
          // You can then do whatever you need with the data here, such as setting it to state.
        }
    
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    const getMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getMessages`);
    
        if (response.ok) {
          const data = await response.json();
          let flattenedData: any = [];
          
          Object.values(data).forEach((value: any) => {
            flattenedData = [...flattenedData, ...value];
          });
          
          const formattedData = flattenedData.map((message: any, id: Number) => ({
            id: id,
            text: message.message,
            topic: message.topic
          }));
    
          // Initialize an object to store the count of each topic
          const topicCount: { [topic: string]: number } = {};
    
          // Iterate through the flattenedData to extract and count the topics
          flattenedData.forEach((message: any) => {
            if (message.topic in topicCount) {
              topicCount[message.topic]++;
            } else {
              topicCount[message.topic] = 1;
            }
          });
          const topicsData = Object.entries(topicCount);

          // Set the states
          setRows(formattedData);
          setTopicsData(topicsData);
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
    setRows(rows.filter(row => row.id !== id));
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

  return (
    <main className="min-h-screen bg-[#858585]">
      <div className="flex justify-between p-5 bg-[#575757]">
      <Link href="/">
      <div className="text-lg text-white">
          CRSA Dashboard
        </div>
          </Link>
      </div>
     <div className="flex flex-col items-center justify-center p-4">
      <BubbleChart data={topicsData} width={700} height={300} />

      <div className="my-4 p-4 border-black border-2 rounded w-fit">
        <label htmlFor="topic" className="mr-2">Topic:</label>
        <select id="topic" value={selectedTopic} onChange={handleTopicChange} className="mr-4 p-1">
        <option value="none">Select topic...</option>
          {topicsData && topicsData.map((topic: string, i: number) => (
            <option key={i} value={topic[0]}>{topic[0]}</option>
          )) }
        </select>

        
        <button onClick={handleAZsort}  className="bg-black w-fit hover:bg-gray-200 hover:text-black text-white py-2 px-4 rounded ">Sort: A-Z</button>
        
        </div>
        <table className="w-1/2 mt-4 border-black border-2">
          <tbody>
            {filteredRows.map(row => (
              <tr key={row.id}>
                <td className="border-black border-2 p-2">{row.text}</td>
                <td className="border-black border-2 p-2">{row.topic}</td>
                <td className="border-black border-2 p-2 w-8 text-center">
                  <button onClick={() => handleDeleteRow(row.id)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      

      <button className="my-4 underline text-black" onClick={downloadData}>
        download all data
      </button>
    </div>
    </main>
  )
}
