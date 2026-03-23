import Image from "next/image";
import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="min-h-screen w-screen flex">
        {/* File Upload Sidebar */}
        <div className="w-[25vw] min-h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200 shadow-lg">
          <div className="flex flex-col justify-center items-center gap-6 p-8 h-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Document AI
              </h1>
              <p className="text-gray-600 text-sm">Upload and chat with your documents</p>
            </div>
            
            <div className="w-full max-w-xs">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Upload Your File
              </h3>
              <div className="flex justify-center">
                <FileUploadComponent />
              </div>
              <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                Supported formats: PDF, DOC, DOCX<br />
                Max file size: 10MB
              </p>
            </div>

            {/* Feature highlights */}
            <div className="mt-8 space-y-3 w-full max-w-xs">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span>AI-powered document analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Natural language queries</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Instant intelligent responses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-[75vw] min-h-screen">
          <div className="h-full flex flex-col">
            <ChatComponent />
          </div>
        </div>
      </div>
    </div>
  );
}