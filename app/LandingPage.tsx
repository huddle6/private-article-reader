"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

const how_it_works = [
  {
    id: 1,
    text: "You enter URL. ( News Item / Blog )."
  },
  {
    id: 2,
    text: "Our bot goes and fetches the page and takes out article content and strips everything else including trackers."
  },
  {
    id: 3,
    text: "We display it in an easy to read format."
  },
];

const LandingPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [history, setHistory] = useState<{ link: string, date: string }[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedHistory = localStorage.getItem('linkHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEntry = { link: urlInput, date: new Date().toISOString() };
    let history = JSON.parse(localStorage.getItem('linkHistory') || '[]');

    // Remove duplicates
    history = history.filter((entry: { link: string }) => entry.link !== urlInput);
    history.unshift(newEntry);
    if (history.length > 100) history = history.slice(0, 100);
    localStorage.setItem('linkHistory', JSON.stringify(history));
    setHistory(history);

    const userAgent = navigator.userAgent;
    router.push({
      pathname: '/article',
      query: { url: urlInput, userAgent: userAgent }
    });
  };

  return (
    <div className="px-2">
      {/* Main form */}
      <div className="my-4 border-b-2">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center gap-4 my-4"
        >
          <input
            type="url"
            name="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            required
            className="flex-1 px-3 py-2 border-2 rounded outline-none"
            placeholder="Enter article URL here."
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            Load Article
          </button>
        </form>
      </div>

      {/* History section */}
      <div className="my-4 border-b-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">History</h2>
          <button
            onClick={() => {
              localStorage.removeItem('linkHistory');
              setHistory([]);
            }}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-800"
          >
            Clear History
          </button>
        </div>
        <ul className="max-h-40 overflow-y-auto">
          {history.map((entry, index) => (
            <li key={index} className="flex justify-between">
              <span
                onClick={() => setUrlInput(entry.link)}
                className="cursor-pointer text-blue-600"
              >
                {entry.link}
              </span>
              <span>{new Date(entry.date).toLocaleString('en-GB')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How it works */}
      <div className="flex flex-col gap-4 px-4 py-4 rounded shadow-lg">
        <h2 
          className="text-lg font-bold cursor-pointer text-left focus:outline-none"
          onClick={toggleCollapse}
        >
          How it works ? {isCollapsed ? "" : ""}
        </h2>
        
        {!isCollapsed && (
          <div>
            {
              how_it_works.map(item => (
                <div key={item.id} className="flex flex-row items-center gap-2 mb-2"> {/* Add margin-bottom for spacing */}
                  <span className="px-2 font-bold text-white bg-black rounded-full ">{item.id}</span>
                  <span>{item.text}</span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
