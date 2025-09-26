"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../store/authStore"; // adjust path if needed
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ToastWrapper from "@/component/ToastWrapper";

const AIStudyCompanionPage = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { messages, sendChat, loading, user, fetchUser } = useAuthStore();

  // Run fetchUser once when component mounts
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Auto-scroll only when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    await sendChat(input, file);
    setInput("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col items-start">
        <p className="text-[30px] font-semibold text-blue-600">AI Study Companion</p>
        <p className="text-gray-500 text-[14px]">Smart help when you need it, 24/7.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white shadow rounded-full flex items-center gap-3 px-4 py-2 w-full max-w-2xl mx-auto mt-4">
        <button className="text-gray-500 hover:text-blue-600">
          <Mic size={22} />
        </button>

        <input
          type="text"
          placeholder="Ask me anything..."
          className="flex-1 border-none outline-none p-4 px-2 text-gray-700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* File Upload */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className={`text-gray-500 hover:text-blue-600 ${file ? "text-blue-600" : ""}`}
          onClick={() => fileInputRef.current.click()}
        >
          <Paperclip size={22} />
        </button>

        {/* Send Button */}
        <button
          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col flex-1 mt-10 w-full max-w-2xl mx-auto overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 p-3 rounded-xl max-w-[85%] prose prose-sm sm:prose-base ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white prose-invert"
                  : "mr-auto bg-white shadow border"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>

              {msg.file && (
                <span className="text-xs text-gray-400 block mt-1">
                  📎 {msg.file.name} ({(msg.file.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">
            Start the conversation by asking something...
          </p>
        )}

        {loading && (
          <div className="mr-auto bg-gray-200 text-gray-800 p-3 rounded-xl flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Thinking...
          </div>
        )}

        {/* Auto scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Show selected file preview */}
      {file && (
        <div className="max-w-2xl mx-auto mt-2 text-sm text-gray-600 flex items-center gap-2">
          <span>📂 {file.name}</span>
          <button
            className="text-red-500 hover:underline text-xs"
            onClick={() => setFile(null)}
          >
            Remove
          </button>
        </div>
      )}
      <ToastWrapper />
    </div>
  );
};

export default AIStudyCompanionPage;
