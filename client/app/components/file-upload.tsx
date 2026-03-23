"use client";
import * as React from "react";
import { Upload, CheckCircle, FileText } from "lucide-react";

const FileUploadComponent: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = React.useState<string>('');

  const handleFileUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setUploadStatus('uploading');
    console.log(file.name);
    
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch(
        `api/upload/pdf`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      console.log(data);
      setUploadStatus('success');
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus('error');
    }
  };

  const getUploadIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>;
      case 'success':
        return <CheckCircle size={24} className="text-white" />;
      case 'error':
        return <Upload size={24} className="text-white" />;
      default:
        return <Upload size={24} className="text-white group-hover:rotate-12 transition-transform duration-300" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'from-green-500 via-emerald-500 to-teal-500';
      case 'error':
        return 'from-red-500 via-pink-500 to-rose-500';
      default:
        return 'from-indigo-500 via-purple-500 to-pink-500';
    }
  };

  return (
    <div className="w-full">
      <div className={`flex items-center justify-center w-full h-32 bg-gradient-to-br ${getStatusColor()} rounded-2xl border-2 border-white/20 shadow-xl`}>
        {/* hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          hidden
        />

        <div
          onClick={handleFileUploadButtonClick}
          className="group relative flex flex-col items-center justify-center w-full h-full rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/20"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>

          <div className="relative z-10 flex flex-col items-center gap-2">
            {getUploadIcon()}
            <span className="text-white text-sm font-medium">
              {uploadStatus === 'uploading' ? 'Uploading...' : 
               uploadStatus === 'success' ? 'Uploaded!' :
               uploadStatus === 'error' ? 'Try Again' : 'Upload File'}
            </span>
          </div>
        </div>
      </div>

      {/* File status */}
      {fileName && (
        <div className="mt-3 p-3 bg-white/50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-600" />
            <span className="text-sm text-gray-700 truncate">{fileName}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              uploadStatus === 'success' ? 'bg-green-500' :
              uploadStatus === 'error' ? 'bg-red-500' :
              uploadStatus === 'uploading' ? 'bg-yellow-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-500">
              {uploadStatus === 'success' ? 'Ready for questions' :
               uploadStatus === 'error' ? 'Upload failed' :
               uploadStatus === 'uploading' ? 'Processing...' : 'Uploaded'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
