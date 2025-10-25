import React from "react";

interface Message {
    id: number;
    sender: string; // "agent" or "user"
    text: string;
}

interface ChatBoxProps {
    messages: Message[];
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
    return (
        <div className="max-h-125 min-h-125 overflow-y-auto border border-slate-500 p-4 gap-1">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${
                        msg.sender === "user" ? "justify-start" : "justify-start"
                    } mb-2`}
                >
                    <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            msg.sender === "user"
                                ? "bg-[#40C1FF] text-white"
                                : "bg-gray-700 text-gray-100"
                        }`}
                    >
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
    );
}