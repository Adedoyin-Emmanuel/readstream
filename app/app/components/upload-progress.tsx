import { Progress } from "@/components/ui/progress";
import { UploadProgress } from "../services/upload-service";

interface UploadProgressProps {
  progress: UploadProgress;
}

const UploadProgressComponent: React.FC<UploadProgressProps> = ({
  progress,
}) => {
  return (
    <div className="w-full space-y-2">
      <Progress value={progress.percentage} className="w-full" />
      <p className="text-sm text-gray-600 text-center">
        {progress.percentage}% uploaded
      </p>
    </div>
  );
};

export default UploadProgressComponent;
