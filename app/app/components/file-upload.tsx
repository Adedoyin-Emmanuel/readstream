"use client";

import React, { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file.type === "text/markdown" || file.name.endsWith(".md")) {
        setSelectedFile(file);
        onFileSelect?.(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  return (
    <div className="w-full mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors w-2xl h-80
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".md,text/markdown"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4 h-full">
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">Upload README</p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your .md file here, or click to browse
            </p>
          </div>
        </div>
      </div>

      {selectedFile && <FileDisplay file={selectedFile} />}
    </div>
  );
};

interface FileDisplayProps {
  file: File;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ file }) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border w-full">
      <div className="flex items-center space-x-3">
        <FileText className="w-5 h-5 text-gray-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
