import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { logger } from "../utils";

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      logger(`Client connected: ${socket.id}`);

      socket.on("join:uploads", () => {
        socket.join("uploads");
        logger(`Client ${socket.id} joined general uploads room`);
      });

      socket.on("join:upload", (uploadId: string) => {
        const room = `upload:${uploadId}`;
        socket.join(room);
        logger(`Client ${socket.id} joined room: ${room}`);
      });

      socket.on("leave:upload", (uploadId: string) => {
        const room = `upload:${uploadId}`;
        socket.leave(room);
        logger(`Client ${socket.id} left room: ${room}`);
      });

      socket.on("disconnect", () => {
        logger(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public emitToAll(event: string, data: any): void {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  public emitToRoom(room: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }
}

export default SocketService.getInstance();
