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

  const joinUploadRoom = useCallback((uploadId: string) => {
    socketService.joinUploadRoom(uploadId);
  }, []);

  const handleUploadEvent = useCallback(
    (event: UploadEvent) => {
      if (event.status === "pending" && !uploadStatus) {
        joinUploadRoom(event.uploadId);
      }

      setUploadStatus({
        error: event.error,
        status: event.status,
        uploadId: event.uploadId,
        fileName: event.fileName,
        htmlContent: event.htmlContent,
      });
    },
    [uploadStatus, joinUploadRoom]
  );

  useEffect(() => {
    console.log("🔌 Initializing socket connection in useUploadStatus hook");
    socketService.connect();

    const handleConnect = () => {
      console.log("✅ Socket connected in useUploadStatus hook");
      setIsConnected(true);
      socketService.joinGeneralUploadsRoom();
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected in useUploadStatus hook");
      setIsConnected(false);
    };

    const socket = socketService.getSocket();
    if (socket) {
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      setIsConnected(socket.connected);

      if (socket.connected) {
        console.log("🔗 Socket already connected, joining general room");
        socketService.joinGeneralUploadsRoom();
      }
    }

    console.log("📡 Setting up upload event listeners");
    socketService.onUploadEvent("upload:started", handleUploadEvent);
    socketService.onUploadEvent("upload:processing", handleUploadEvent);
    socketService.onUploadEvent("upload:completed", handleUploadEvent);
    socketService.onUploadEvent("upload:failed", handleUploadEvent);

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      }

      socketService.offUploadEvent("upload:started", handleUploadEvent);
      socketService.offUploadEvent("upload:processing", handleUploadEvent);
      socketService.offUploadEvent("upload:completed", handleUploadEvent);
      socketService.offUploadEvent("upload:failed", handleUploadEvent);
    };
  }, [handleUploadEvent]);

  const leaveUploadRoom = useCallback((uploadId: string) => {
    socketService.leaveUploadRoom(uploadId);
    setUploadStatus(null);
  }, []);

  const resetStatus = useCallback(() => {
    setUploadStatus(null);
  }, []);

  return {
    isConnected,
    resetStatus,
    uploadStatus,
    joinUploadRoom,
    leaveUploadRoom,
  };
};
