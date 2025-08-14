import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";

import { redisClient } from "./utils";
import { PORT } from "./constants/app";
import JobsConfig from "./jobs/jobs-config";
import corsOptions from "./utils/cors-options";
import baseRouter from "./features/base/route";

import uploadRouter from "./features/upload/route";
import { useErrorHandler, useNotFound } from "./middlewares/";

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json({}));
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json({ limit: "1mb" }));

app.use("/v1", baseRouter);
app.use("/v1/upload", uploadRouter);

app.use(useNotFound);
app.use(useErrorHandler);

export const server = app.listen(PORT, async () => {
  const allJobs = new JobsConfig();

  await redisClient.connect();

  allJobs.start();

  console.log(`Server running on port ${PORT}`);
});
