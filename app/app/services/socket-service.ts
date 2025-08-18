import { io, Socket } from "socket.io-client";

export interface UploadEvent {
  error?: string;
  uploadId: string;
  fileName: string;
  htmlContent?: string;
  status: "pending" | "processing" | "completed" | "failed";
}

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private eventListeners: Map<string, Set<(data: UploadEvent) => void>> =
    new Map();

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:2800"
    );

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.setupEventListeners();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public joinUploadRoom(uploadId: string): void {
    if (this.socket?.connected) {
      this.socket.emit("join:upload", uploadId);
    }
  }

  public leaveUploadRoom(uploadId: string): void {
    if (this.socket?.connected) {
      this.socket.emit("leave:upload", uploadId);
    }
  }

  public onUploadEvent(
    event: string,
    callback: (data: UploadEvent) => void
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public offUploadEvent(
    event: string,
    callback: (data: UploadEvent) => void
  ): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    const events = [
      "upload:started",
      "upload:failed",
      "upload:processing",
      "upload:completed",
    ];

    events.forEach((event) => {
      this.socket!.on(event, (data: UploadEvent) => {
        const listeners = this.eventListeners.get(event);
        if (listeners) {
          listeners.forEach((callback) => callback(data));
        }
      });
    });
  }
}

export default SocketService.getInstance();
