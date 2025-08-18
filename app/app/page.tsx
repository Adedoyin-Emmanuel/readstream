"use client";

import React, { useState, useCallback } from "react";
import { useUploadStatus } from "./hooks/use-upload-status";

import FileUpload from "./components/file-upload";
import HtmlCanvas from "./components/html-canvas";

const App = () => {
  const { uploadStatus, resetStatus, isConnected } = useUploadStatus();
  const [showCanvas, setShowCanvas] = useState(false);

  const handleUploadComplete = useCallback(() => {
    setShowCanvas(true);
  }, []);

  const handleUploadStatusChange = useCallback((status: string) => {
    if (
      status === "pending" ||
      status === "processing" ||
      status === "completed" ||
      status === "failed"
    ) {
      setShowCanvas(true);
    }
  }, []);

  const handleUploadAnother = useCallback(() => {
    setShowCanvas(false);
    resetStatus();
  }, [resetStatus]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Chairman, upload your README.md file
        </h1>

        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Socket Connection Status:
          </h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-blue-800">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          {uploadStatus && (
            <div className="mt-2 text-sm text-blue-700">
              <p>Current Status: {uploadStatus.status}</p>
              <p>File: {uploadStatus.fileName}</p>
              <p>Upload ID: {uploadStatus.uploadId}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border min-h-[600px]">
          {showCanvas && uploadStatus ? (
            <HtmlCanvas
              uploadStatus={uploadStatus}
              onUploadAnother={handleUploadAnother}
            />
          ) : (
            <div className="p-8">
              <FileUpload
                onUploadComplete={handleUploadComplete}
                onUploadStatusChange={handleUploadStatusChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
