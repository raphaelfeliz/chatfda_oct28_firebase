import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { MessageSender } from '../types';
import { SendIcon } from './Icons';
const ChatInterface = ({ messages, onSendMessage, isLoading, showTalkToHumanButton, onTalkToHumanClick }) => {
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };
    return (_jsxs("div", { className: "flex flex-col md:h-full bg-[#e3eaff]", children: [_jsx("div", { className: "p-4 md:flex-grow md:overflow-y-auto custom-scrollbar", children: _jsxs("div", { className: "flex flex-col gap-4", children: [messages.map((msg, index) => (_jsx("div", { className: `flex items-start gap-3 ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-xs md:max-w-md p-3 rounded-lg text-white ${msg.sender === MessageSender.USER ? 'bg-green-600 rounded-br-none' : 'bg-[#14293D] rounded-bl-none'}`, children: _jsx("p", { className: "text-base whitespace-pre-wrap", children: msg.text }) }) }, index))), isLoading && (_jsx("div", { className: "flex items-start gap-3 justify-start", children: _jsx("div", { className: "max-w-xs md:max-w-md p-3 rounded-lg bg-[#14293D] rounded-bl-none", children: _jsxs("div", { className: "flex items-center justify-center space-x-1", children: [_jsx("div", { className: "w-2 h-2 bg-white/60 rounded-full animate-pulse [animation-delay:-0.3s]" }), _jsx("div", { className: "w-2 h-2 bg-white/60 rounded-full animate-pulse [animation-delay:-0.15s]" }), _jsx("div", { className: "w-2 h-2 bg-white/60 rounded-full animate-pulse" })] }) }) }))] }) }), _jsxs("div", { className: "p-4 border-t border-gray-300 flex-shrink-0", children: [showTalkToHumanButton && (_jsx("div", { className: "mb-3", children: _jsx("button", { onClick: onTalkToHumanClick, className: "w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-500 transition-colors", "aria-label": "Fale com um especialista via WhatsApp", children: "\uD83D\uDCAC Especialista no Whatsapp" }) })), _jsxs("form", { onSubmit: handleSubmit, className: "flex items-center gap-3", children: [_jsx("input", { type: "text", value: inputValue, onChange: handleInputChange, placeholder: "Digite sua d\u00FAvida...", className: "flex-grow bg-white text-gray-900 placeholder-gray-500 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !inputValue.trim(), className: "bg-indigo-600 text-white rounded-full p-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors", "aria-label": "Enviar mensagem", children: _jsx(SendIcon, {}) })] })] })] }));
};
export default ChatInterface;
