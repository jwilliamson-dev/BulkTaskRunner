import { CompletedJob } from './types'

export abstract class JobLogger {
  /**
   * Reports the results of a completed job
   * @param job The job to log
   */
  public abstract log(job: CompletedJob): void
}
