import { useState, ReactNode, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import Chat from "./Chat";
import { Message } from "../types/chatTypes";

interface AutoLayoutProps {
  title: string;
  description: string;
  scenario: string;
  children: ReactNode;
  initialMessages?: Message[];
  topic?: string;
}

export default function AutoLayout({
  title,
  description,
  scenario,
  children,
  initialMessages = [],
  topic = "Auto Financing",
}: AutoLayoutProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [promptValue, setPromptValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isScenarioExpanded, setIsScenarioExpanded] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChat = async () => {
    if (!promptValue.trim() || isLoading) return;

    const userMessage = { role: "user", content: promptValue };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setPromptValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/getChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            userMessage,
          ],
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value);
          text += chunkValue;
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: text,
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
    if (!isChatVisible) {
      setIsChatOpen(true);
    }
  };
  
  const toggleScenario = () => {
    setIsScenarioExpanded(!isScenarioExpanded);
  };
  
  const openScenarioModal = () => {
    setIsScenarioModalOpen(true);
  };
  
  const closeScenarioModal = () => {
    setIsScenarioModalOpen(false);
  };
  
  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeScenarioModal();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section with Collapsible Scenario */}
      <div className="bg-blue-800 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="max-w-3xl mb-2">{description}</p>
          <button 
              onClick={openScenarioModal}
              className="text-blue-800 bg-white hover:bg-gray-100 px-4 py-2 rounded-md transition"
            >
              Task Details
            </button>
          
          {/* Expandable Scenario Container */}
          {isScenarioExpanded && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-4 max-w-4xl transition-all duration-300 ease-in-out">
              <h2 className="text-xl font-semibold mb-3">Scenario</h2>
              <div className="text-white text-opacity-90 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{scenario}</ReactMarkdown>
              </div>
            </div>
          )}
          
          {/* Scenario Modal */}
          {isScenarioModalOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={handleModalClick}
            >
              <div 
                ref={modalRef}
                className="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-blue-800 text-white px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Scenario Details</h2>
                  <button 
                    onClick={closeScenarioModal}
                    className="text-white hover:text-gray-200 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6">
                  <div className="prose max-w-none">
                    <ReactMarkdown>{scenario}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Main Calculation Area */}
        <div className={`w-full ${isChatVisible ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300 px-4 py-6`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Calculations</h2>
            {children}
          </div>
          
          {/* Chat Toggle Button (Mobile only) */}
          <div className="mt-6 mb-4 flex justify-end lg:hidden">
            <button
              onClick={toggleChatVisibility}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
            >
              {isChatVisible ? "Hide Assistant" : "Show Assistant"}
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        {isChatVisible && (
          <div className="fixed lg:relative bottom-0 left-0 right-0 lg:bottom-auto lg:left-auto lg:right-auto bg-white shadow-md lg:shadow-none z-10 lg:w-1/3 transition-all duration-300">
            <div 
              className="bg-blue-700 text-white py-3 px-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <h3 className="font-bold cursor-pointer" onClick={toggleChat}>Finance Assistant</h3>
                <button 
                  className="ml-4 hidden lg:block px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                  onClick={toggleChatVisibility}
                >
                  Hide
                </button>
              </div>
              <button className="focus:outline-none cursor-pointer" onClick={toggleChat}>
                {isChatOpen ? '▼' : '▲'}
              </button>
            </div>
            
            {isChatOpen && (
              <div className="h-[400px] lg:h-[calc(100vh-180px)] overflow-hidden">
                <Chat
                  messages={messages}
                  disabled={isLoading}
                  promptValue={promptValue}
                  setPromptValue={setPromptValue}
                  setMessages={setMessages}
                  handleChat={handleChat}
                  topic={topic}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Show Assistant Button (Desktop) */}
        {!isChatVisible && (
          <div className="hidden lg:block fixed right-6 bottom-6">
            <button
              onClick={toggleChatVisibility}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-lg flex items-center"
            >
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
              </span>
              Finance Assistant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}