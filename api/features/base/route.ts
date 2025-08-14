import express from "express";
import BaseController from "./controller";
import uploadRouter from "../upload/route";

const baseRouter = express.Router();

baseRouter.get("/", BaseController.Hello);
baseRouter.use("/upload", uploadRouter);

export default baseRouter;
