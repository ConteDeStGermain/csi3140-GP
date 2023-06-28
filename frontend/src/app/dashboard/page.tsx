"use client"
import { useState } from 'react';
import BubbleChart from '../components/bubbleChart';

interface Row {
  id: number;
  text: string;
}

export default function Dashboard() {
  const [checkbox, setCheckbox] = useState(false);
  const [topic, setTopic] = useState('');
  const [rows, setRows] = useState<Row[]>([
    // initial data for the table
    { id: 1, text: 'Row 1' },
    { id: 2, text: 'Row 2' },
    { id: 3, text: 'Row 2' },
    { id: 4, text: 'Row 2' },
    { id: 5, text: 'Row 2' },
    { id: 6, text: 'Row 2' },
    // add more rows as needed
  ]);

  const data = [...Array(2)].map((_, i) => ({ id: i, value: Math.random() * 100 }));

  const handleCheckboxChange = () => {
    setCheckbox(!checkbox);
  };

  const handleTopicChange = (e: any) => {
    setTopic(e.target.value);
  };

  const handleDeleteRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#858585]">
      <div className="flex justify-between p-5 bg-[#575757]">
        <div className="text-lg text-white">
          CRSA Dashboard
        </div>
      </div>
     <div className="flex flex-col items-center justify-center p-4">
      <BubbleChart data={data} width={700} height={300} />

      <div className="my-4 p-4 border-black border-2 rounded w-fit">
        <label htmlFor="topic" className="mr-2">Topic:</label>
        <select id="topic" value={topic} onChange={handleTopicChange} className="mr-4 p-1">
          {/* Populate with your options */}
          <option value="">Select topic...</option>
          <option value="topic1">Topic 1</option>
          <option value="topic2">Topic 2</option>
        </select>

        <label htmlFor="checkbox" className="mr-2">A-Z:</label>
        <input type="checkbox" id="checkbox" checked={checkbox} onChange={handleCheckboxChange} className="mr-4" />
        </div>
        {/* Dynamic table */}
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
      

      <button className="my-4 underline text-black">
        download all data
      </button>
    </div>
    </main>
  )
}
