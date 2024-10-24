export interface IJobHandler {
  MAX_CONCURRENCY: number
  processJob(job: WorkingJob | CompletedJob): void
}

export interface IJobReader {
  done: boolean
  readJobs(
    numJobsToRead: number
  ): Promise<Record<string, string | number | object>[]>
}

export interface IJobLogger {
  handleCompletedJob(job: CompletedJob): void
}

export interface PendingJob {
  status: 'pending'
  createdAt: string
  data: Record<string, string | number | object>
  id: `${string}-${string}-${string}-${string}-${string}`
}

export interface WorkingJob {
  status: 'working'
  createdAt: string
  data: Record<string, string | number | object>
  id: `${string}-${string}-${string}-${string}-${string}`
  result?: Record<string, string | number | object>
}

export interface CompletedJob {
  status: 'complete' | 'error'
  createdAt: string
  data: Record<string, string | number | object>
  id: `${string}-${string}-${string}-${string}-${string}`
  result: Record<string, string | number | object>
}

export type Job = PendingJob | WorkingJob | CompletedJob
