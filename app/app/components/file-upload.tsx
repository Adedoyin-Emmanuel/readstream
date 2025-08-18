"use client";

import { Upload } from "lucide-react";
import React, { useState, useCallback } from "react";

import FileDisplay from "./file-display";
import UploadProgressComponent from "./upload-progress";
import { uploadFile, UploadProgress } from "../services/upload-service";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (response: unknown) => void;
  onUploadError?: (error: unknown) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUploadComplete,
  onUploadError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const handleUpload = useCallback(
    async (file: File) => {
      if (isUploading) return;

      setIsUploading(true);
      setUploadProgress({ percentage: 0, loaded: 0, total: file.size });

      try {
        const response = await uploadFile(file, (progress) => {
          setUploadProgress(progress);
        });

        onUploadComplete?.(response);
      } catch (error) {
        onUploadError?.(error);
      } finally {
        setIsUploading(false);
        setUploadProgress(null);
      }
    },
    [isUploading, onUploadComplete, onUploadError]
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file.type === "text/markdown" || file.name.endsWith(".md")) {
        setSelectedFile(file);
        onFileSelect?.(file);

        handleUpload(file);
      }
    },
    [onFileSelect, handleUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect, isUploading]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isUploading) {
        setIsDragOver(true);
      }
    },
    [isUploading]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return;

      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect, isUploading]
  );

  const handleRemoveFile = useCallback(() => {
    if (isUploading) return;

    setSelectedFile(null);
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }, [isUploading]);

  const handleClick = useCallback(() => {
    if (!isUploading) {
      document.getElementById("file-input")?.click();
    }
  }, [isUploading]);

  return (
    <div className="w-full mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors w-2xl h-80
          ${
            isUploading
              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
              : isDragOver
              ? "border-blue-500 bg-blue-50 cursor-pointer"
              : "border-gray-300 hover:border-gray-400 cursor-pointer"
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          id="file-input"
          type="file"
          accept=".md,text/markdown"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4 h-full">
          {isUploading ? (
            <>
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="w-6 h-6 text-gray-600 animate-pulse" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Uploading...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Gentleman, wait while your file is being uploaded
                </p>
              </div>
              {uploadProgress && (
                <div className="w-full max-w-xs">
                  <UploadProgressComponent progress={uploadProgress} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="p-3 bg-gray-100 rounded-full">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Upload README
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop your .md file here, or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedFile && !isUploading && (
        <FileDisplay file={selectedFile} onRemove={handleRemoveFile} />
      )}
    </div>
  );
};

export default FileUpload;
