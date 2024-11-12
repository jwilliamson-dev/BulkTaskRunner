import { JobHandler } from './job-handler'
import { JobLogger } from './job-logger'

export interface TaskRunnerParams {
  reader: AsyncGenerator<JobRecord, void, void>
  handler: JobHandler
  logger: JobLogger
  maxConcurrency: number
}

export interface PendingJob {
  records: JobRecord[]
  id: `${string}-${string}-${string}-${string}-${string}`
  status: 'pending'
}

export interface CompletedJob {
  records: JobRecord[]
  id: `${string}-${string}-${string}-${string}-${string}`
  result: JobRecord[]
  status: 'success' | 'fail'
}

export type JobRecord = Record<string, string | number | object>
