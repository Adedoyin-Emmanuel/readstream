"use client";

import React, { useState, useCallback } from "react";

import FileUpload from "./components/file-upload";
import HtmlCanvas from "./components/html-canvas";
import { useUploadStatus } from "./hooks/use-upload-status";

const App = () => {
  const { uploadStatus, resetStatus } = useUploadStatus();
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
