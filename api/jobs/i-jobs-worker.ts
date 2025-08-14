import { Job } from "bullmq";

export interface IJob {
  start(): void;
  process(job: Job): void;
}
