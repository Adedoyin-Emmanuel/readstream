const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    const allowedOriginPatterns = allowedOrigins.map(
      (origin) =>
        new RegExp(`^${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`)
    );

    if (
      !origin ||
      allowedOriginPatterns.some((pattern) => pattern.test(origin))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
