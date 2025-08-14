import { FileText, X } from "lucide-react";

interface FileDisplayProps {
  file: File;
  onRemove: () => void;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ file, onRemove }) => {
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
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default FileDisplay;
