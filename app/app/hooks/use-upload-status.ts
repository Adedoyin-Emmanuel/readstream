import { useState, useEffect, useCallback } from "react";
import socketService, { UploadEvent } from "../services/socket-service";

export interface UploadStatus {
  uploadId: string;
  fileName: string;
  status: "pending" | "processing" | "completed" | "failed";
  htmlContent?: string;
  error?: string;
}

export const useUploadStatus = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketService.connect();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const socket = (socketService as any).socket;
    if (socket) {
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      setIsConnected(socket.connected);
    }

    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      }
    };
  }, []);

  const handleUploadEvent = useCallback((event: UploadEvent) => {
    setUploadStatus({
      uploadId: event.uploadId,
      fileName: event.fileName,
      status: event.status,
      htmlContent: event.htmlContent,
      error: event.error,
    });
  }, []);

  const joinUploadRoom = useCallback((uploadId: string) => {
    socketService.joinUploadRoom(uploadId);
    
    socketService.onUploadEvent("upload:started", handleUploadEvent);
    socketService.onUploadEvent("upload:processing", handleUploadEvent);
    socketService.onUploadEvent("upload:completed", handleUploadEvent);
    socketService.onUploadEvent("upload:failed", handleUploadEvent);
  }, [handleUploadEvent]);

  const leaveUploadRoom = useCallback((uploadId: string) => {
    socketService.leaveUploadRoom(uploadId);
    setUploadStatus(null);
  }, []);

  const resetStatus = useCallback(() => {
    setUploadStatus(null);
  }, []);

  return {
    uploadStatus,
    isConnected,
    joinUploadRoom,
    leaveUploadRoom,
    resetStatus,
  };
};
