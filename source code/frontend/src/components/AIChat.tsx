import React, { useState } from "react";

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
            <span className="font-bold">AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            <div className="bg-white p-3 rounded-lg shadow-sm text-sm border border-gray-100">
              Hello! I'm your AI teaching assistant. How can I help you today?
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full px-3 py-2 border rounded-full text-sm focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform active:scale-95"
        >
          🤖
        </button>
      )}
    </div>
  );
};

export default AIChat;
