import React, { useState } from 'react';
import type { ChatMessage } from '../types';
import { MessageSender } from '../types';
import { SendIcon } from './Icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  showTalkToHumanButton?: boolean;
  onTalkToHumanClick?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, showTalkToHumanButton, onTalkToHumanClick }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col md:h-full bg-[#e3eaff]">
      <div className="p-4 md:flex-grow md:overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg text-white ${msg.sender === MessageSender.USER ? 'bg-green-600 rounded-br-none' : 'bg-[#14293D] rounded-bl-none'}`}>
                <p className="text-base whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-[#14293D] rounded-bl-none">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-gray-300 flex-shrink-0">
        {showTalkToHumanButton && (
            <div className="mb-3">
                <button
                    onClick={onTalkToHumanClick}
                    className="w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-500 transition-colors"
                    aria-label="Fale com um especialista via WhatsApp"
                >
                    💬 Especialista no Whatsapp
                </button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Digite sua dúvida..."
            className="flex-grow bg-white text-gray-900 placeholder-gray-500 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-indigo-600 text-white rounded-full p-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
            aria-label="Enviar mensagem"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;