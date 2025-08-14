import { FileText } from "lucide-react";

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

export default FileDisplay;