"use client";

import React, { useState, useEffect } from "react";

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
    text: "We display it in and easy to read format."
  },
];

const LandingPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('linkHistory')) || []);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="px-2">
      {/* Main form */}
      <div className="my-4 border-b-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const urlInput = e.target.url.value;
            let history = JSON.parse(localStorage.getItem('linkHistory')) || [];
            history.unshift(urlInput);
            if (history.length > 100) history = history.slice(0, 100);
            localStorage.setItem('linkHistory', JSON.stringify(history));
            e.target.submit();
          }}
          action="/article"
          method="GET"
          className="flex flex-col items-center gap-4 my-4"
        >
          <input
            type="url"
            name="url"
            required
            className="flex-1 min-width-full px-3 py-2 border-2 rounded outline-none"
            placeholder="Enter article URL here."
          />
          <button
            type="submit"
            className="min-width-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            Load Article
          </button>
        </form>
      </div>

      {/* History section */}
      <div className="my-4 border-b-2">
        <h2 className="text-lg font-bold">History</h2>
        <ul>
          {history.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem('linkHistory');
            setHistory([]);
          }}
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-800"
        >
          Clear
        </button>
      </div>

      {/* How it works */}
      <div className="flex flex-col gap-4 px-4 py-4 bg-white rounded shadow-lg">
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
