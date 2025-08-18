import { useState, useEffect, useCallback } from "react";
import socketService, { UploadEvent } from "../services/socket-service";

export interface UploadStatus {
  error?: string;
  fileName: string;
  uploadId: string;
  htmlContent?: string;
  status: "pending" | "processing" | "completed" | "failed";
}

export const useUploadStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  useEffect(() => {
    socketService.connect();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const socket = socketService.getSocket();
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
      error: event.error,
      status: event.status,
      uploadId: event.uploadId,
      fileName: event.fileName,
      htmlContent: event.htmlContent,
    });
  }, []);

  const joinUploadRoom = useCallback(
    (uploadId: string) => {
      socketService.joinUploadRoom(uploadId);

      socketService.onUploadEvent("upload:started", handleUploadEvent);
      socketService.onUploadEvent("upload:processing", handleUploadEvent);
      socketService.onUploadEvent("upload:completed", handleUploadEvent);
      socketService.onUploadEvent("upload:failed", handleUploadEvent);
    },
    [handleUploadEvent]
  );

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
