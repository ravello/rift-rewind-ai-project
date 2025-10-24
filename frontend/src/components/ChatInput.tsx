import { useState } from "react";

interface ChatInputProps {
    onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend}) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return(
        <form onSubmit={handleSubmit} className="flex mt-2">
            <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-gray-800 text-white px-3 py-2 rounded-l-md border border-gray-700 focus:outline-none"
                placeholder="Type your message..."
            />
            <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
            >
                Send
            </button>
        </form>
    );
}