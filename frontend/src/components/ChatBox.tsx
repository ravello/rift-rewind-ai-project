import React from "react";
import { useAutoScroll } from "../hooks/useAutoScroll";

interface Message {
    id: number;
    sender: string; // "agent" or "user"
    text: string;
}

interface ChatBoxProps {
    messages: Message[];
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
    const scrollRef = useAutoScroll<HTMLDivElement>([messages]);

    return (
        <div ref={scrollRef} className="h-125 overflow-y-auto gap-1"> {/* border border-slate-500 */}
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