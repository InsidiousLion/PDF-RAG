"use client";
import * as React from "react";
import { Send, MessageCircle } from "lucide-react";

const ChatComponent: React.FC = () => {
    const [message, setMessage] = React.useState<string>("");
    const [answer, setAnswer] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleQuerySubmission = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/chat?message=${message}`);
            const data = await res.json();
            setAnswer(data.content);
        } catch (error) {
            console.error("Chat request failed:", error);
        } finally {
            setIsLoading(false);
            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
            e.preventDefault();
            handleQuerySubmission();
        }
    };

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-6 h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        AI Assistant
                    </h2>
                    <p className="text-gray-600 text-sm">Ask questions about your uploaded document</p>
                </div>
            </div>

            {/* Chat Response Area */}
            <div className="flex-1 mb-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
                    {answer ? (
                        <div className="prose prose-gray max-w-none">
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-l-4 border-indigo-500">
                                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                    {answer}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Ready to help!</p>
                            <p className="text-sm">Upload a document and ask me anything about it.</p>
                        </div>
                    )}
                    
                    {isLoading && (
                        <div className="flex items-center gap-3 mt-4 p-4 bg-gray-50 rounded-xl">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            <span className="text-gray-600">Thinking...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question about your document..."
                            className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 bg-gray-50 rounded-xl p-4 min-h-[60px] max-h-[120px]"
                            rows={2}
                        />
                    </div>
                    <button
                        onClick={handleQuerySubmission}
                        disabled={!message.trim() || isLoading}
                        className="group relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-xl"
                    >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <Send className="w-5 h-5 text-white relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-xs text-gray-400">Press Enter to send, Shift+Enter for new line</span>
                    <span className="text-xs text-gray-400">{message.length}/1000</span>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
