export interface TaskRunnerParams {
  reader: AsyncGenerator<JobData, void, void>
  handler: (job: PendingJob) => Promise<CompletedJob>
  logger: (job: CompletedJob) => void
  maxConcurrency: number
}

export interface PendingJob {
  data: JobData
  id: `${string}-${string}-${string}-${string}-${string}`
  status: 'pending'
}

export interface CompletedJob {
  data: JobData
  id: `${string}-${string}-${string}-${string}-${string}`
  result: JobData
  status: 'success' | 'fail'
}

export type JobData = Record<string, string | number | object>
