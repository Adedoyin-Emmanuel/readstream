import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

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
      console.log(`Client connected: ${socket.id}`);

      // Handle joining upload rooms
      socket.on("join:upload", (uploadId: string) => {
        const room = `upload:${uploadId}`;
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
      });

      // Handle leaving upload rooms
      socket.on("leave:upload", (uploadId: string) => {
        const room = `upload:${uploadId}`;
        socket.leave(room);
        console.log(`Client ${socket.id} left room: ${room}`);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
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
