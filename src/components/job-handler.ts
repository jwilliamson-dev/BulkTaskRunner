import { PendingJob, CompletedJob } from './types'

export abstract class JobHandler {
  /** The number of records one job is able to handle */
  public MAX_RECORDS_PER_JOB = 1

  /**
   * Processes a job
   * @param job The job to process
   */
  public abstract process(job: PendingJob): Promise<CompletedJob>
}
