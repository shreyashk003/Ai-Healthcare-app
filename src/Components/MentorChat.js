import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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
      const res = await axios.post("http://localhost:9000/ask", { query: input });
      setChatLog((prev) => [...prev, { from: "mentor", text: res.data.response }]);
    } catch {
      setChatLog((prev) => [...prev, { from: "mentor", text: "⚠️ Could not get response." }]);
    }
    setInput("");
    setLoading(false);
  };

  const handleSuggest = async () => {
    setLoading(true);
    setChatLog((prev) => [...prev, { from: "user", text: "[Requested study suggestion]" }]);
    try {
      const res = await axios.post("http://localhost:9000/suggest", { profile: "" });
      setChatLog((prev) => [...prev, { from: "mentor", text: res.data.response }]);
    } catch {
      setChatLog((prev) => [...prev, { from: "mentor", text: "⚠️ Could not get suggestion." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🤖 AI Mentor Chat</h2>

      <div className="h-80 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded border border-gray-300">
        {chatLog.length === 0 && (
          <p className="text-gray-500 italic text-center">
            Start by asking a doubt or requesting a suggestion...
          </p>
        )}
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "mentor" && (
              <div className="mr-2 mt-1 text-purple-600">🤖</div>
            )}
            <div
              className={`p-3 rounded-lg text-sm max-w-[70%] shadow-md ${
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
            {msg.from === "user" && (
              <div className="ml-2 mt-1 text-blue-600">🙋‍♂️</div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your doubt here..."
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          rows={3}
        ></textarea>

        <div className="flex justify-between mt-3 gap-2">
          <button
            onClick={handleAsk}
            disabled={loading || !input.trim()}
            className={`flex-1 py-2 px-4 rounded-md text-white font-semibold ${
              loading || !input.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Ask Doubt
          </button>
          <button
            onClick={handleSuggest}
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Suggest Topic
          </button>
        </div>

        {loading && <p className="text-sm text-gray-600 mt-2">Thinking...</p>}
      </div>
    </div>
  );
};

export default MentorChat;
