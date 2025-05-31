import React, { useState, useRef, useEffect } from "react";
import chatImage from "../chat.jpg"; // Update path if needed

const MentorChat = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setChatLog((prev) => [...prev, { from: "user", text: input }]);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input })
      });
      const data = await response.json();
      setChatLog((prev) => [...prev, { from: "mentor", text: data.response }]);
    } catch {
      setChatLog((prev) => [...prev, { from: "mentor", text: "⚠️ Could not get response." }]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="text-center mb-3">
        <img
          src={chatImage}
          alt="AI Mentor Illustration"
          className="w-full h-40 object-cover border-4 border-purple-200 shadow-md rounded-md"
        />
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">🤖 MythBuster Chat-Bot</h2>

      <div className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded border border-gray-300">
        {chatLog.length === 0 && (
          <p className="text-gray-500 italic text-center">
            Start by asking a doubt or requesting a suggestion...
          </p>
        )}
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.from === "mentor" && <div className="mr-2 mt-1 text-purple-600">🤖</div>}
            <div
              className={`p-2 rounded-lg text-sm max-w-[70%] shadow-md ${
                msg.from === "user"
                  ? "bg-blue-100 text-right text-blue-900"
                  : "bg-white text-left border border-gray-200"
              }`}
            >
              <span className="block font-semibold">
                {msg.from === "user" ? "You" : "Mentor"}
              </span>
              {msg.text}
            </div>
            {msg.from === "user" && <div className="ml-2 mt-1 text-blue-600">🙋‍♂️</div>}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your doubt here..."
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          rows={2}
        ></textarea>

        <div className="mt-2">
          <button
            onClick={handleAsk}
            disabled={loading || !input.trim()}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              loading || !input.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Ask Doubt
          </button>
        </div>

        {loading && <p className="text-sm text-gray-600 mt-2">Thinking...</p>}
      </div>
    </div>
  );
};

export default MentorChat;
