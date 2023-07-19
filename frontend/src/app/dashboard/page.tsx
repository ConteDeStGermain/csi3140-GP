"use client"
import { useState, useEffect } from 'react';
import BubbleChart from '../components/bubbleChart';

interface Row {
  id: number;
  text: string;
}

export default function Dashboard() {
  const [checkbox, setCheckbox] = useState(false);
  const [topic, setTopic] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [topicsData, setTopicsData] = useState<any>();

  useEffect(() => {
    const getTopics = async (number: number) => {
      try {
        const response = await fetch(`http://localhost:8080/getTopics?number=${number}`);
    
        if (response.ok) {
          const data = await response.json();
          console.log(data.topics);
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
            text: message.message
          }));
          setRows(formattedData);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } 
    };

    getMessages();
    getTopics(3);
  }, []);

  const handleCheckboxChange = () => {
    setCheckbox(!checkbox);
  };

  const handleTopicChange = (e: any) => {
    setTopic(e.target.value);
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

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
        <div className="text-lg text-white">
          CRSA Dashboard
        </div>
      </div>
     <div className="flex flex-col items-center justify-center p-4">
      <BubbleChart data={topicsData} width={700} height={300} />

      <div className="my-4 p-4 border-black border-2 rounded w-fit">
        <label htmlFor="topic" className="mr-2">Topic:</label>
        <select id="topic" value={topic} onChange={handleTopicChange} className="mr-4 p-1">
          <option value="">Select topic...</option>
          <option value="topic1">Topic 1</option>
          <option value="topic2">Topic 2</option>
        </select>

        <label htmlFor="checkbox" className="mr-2">A-Z:</label>
        <input type="checkbox" id="checkbox" checked={checkbox} onChange={handleCheckboxChange} className="mr-4" />
        </div>
        <table className="w-1/2 mt-4 border-black border-2">
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td className="border-black border-2 p-2">{row.text}</td>
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
