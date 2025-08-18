"use client";

import DOMPurify from "dompurify";
import { CheckCircle, FileText, Loader2, AlertCircle } from "lucide-react";

import { Skeleton } from "../../components/ui/skeleton";
import { UploadStatus } from "../hooks/use-upload-status";

interface HtmlCanvasProps {
  uploadStatus: UploadStatus | null;
  onUploadAnother: () => void;
}

const HtmlCanvas: React.FC<HtmlCanvasProps> = ({
  uploadStatus,
  onUploadAnother,
}) => {
  if (!uploadStatus) {
    return null;
  }

  const renderLoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-8">
      <div className="flex items-center space-x-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-lg font-medium text-gray-700">
          Processing your README...
        </span>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />

          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Converting markdown to HTML... This may take a few moments.
      </p>
    </div>
  );

  const renderCompletedState = () => (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              README Preview
            </h2>
            <p className="text-sm text-gray-500">{uploadStatus.fileName}</p>
          </div>
        </div>
        <button
          onClick={onUploadAnother}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Upload Another
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {uploadStatus.htmlContent ? (
          <div
            className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-500"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(uploadStatus.htmlContent),
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <FileText className="w-8 h-8 mr-2" />
            No content available
          </div>
        )}
      </div>
    </div>
  );

  const renderFailedState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-8">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <span className="text-lg font-medium text-gray-700">
          Processing Failed
        </span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-600">
          {uploadStatus.error ||
            "An error occurred while processing your README file."}
        </p>
        <p className="text-sm text-gray-500">
          Please try uploading the file again.
        </p>
      </div>

      <button
        onClick={onUploadAnother}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Try Again
      </button>
    </div>
  );

  const renderPendingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-8">
      <div className="flex items-center space-x-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-lg font-medium text-gray-700">
          File Uploaded Successfully
        </span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-600">
          Your README file has been uploaded and is queued for processing.
        </p>
        <p className="text-sm text-gray-500">
          Please wait while we convert your markdown to HTML...
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full animate-pulse"
            style={{ width: "60%" }}
          ></div>
        </div>
      </div>
    </div>
  );

  switch (uploadStatus.status) {
    case "pending":
      return renderPendingState();
    case "processing":
      return renderLoadingState();
    case "completed":
      return renderCompletedState();
    case "failed":
      return renderFailedState();
    default:
      return renderLoadingState();
  }
};

export default HtmlCanvas;
