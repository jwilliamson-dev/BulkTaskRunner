import { EventEmitter } from 'node:events'
import { randomUUID } from 'node:crypto'
import { TaskRunnerParams, PendingJob, CompletedJob, JobRecord } from './types'
import { JobHandler } from './job-handler'
import { JobLogger } from './job-logger'

/**
 * @classdesc A class that runs a processing function on a collection of records
 */
export class BulkTaskRunner extends EventEmitter {
  private MAX_CONCURRENCY: number = 1
  private queue: Array<Promise<CompletedJob> | CompletedJob> = []
  private reader: AsyncGenerator<JobRecord, void, void>
  private handler: JobHandler
  private logger: JobLogger
  private endExecutionPromise: Promise<void>
  private endExectution: ((value: void | PromiseLike<void>) => void) | null =
    null

  /**
   * Create a new BulkTaskRunner
   * @param params The reader, handler, logger used to process jobs, and number of jobs to run concurrently
   */
  constructor(params: TaskRunnerParams) {
    super()
    this.reader = params.reader
    this.handler = params.handler
    this.logger = params.logger
    this.MAX_CONCURRENCY = params.maxConcurrency

    this.on('startJob', this.startJob)
    this.on('process', this.process)
    this.once('end', this.end)

    this.endExecutionPromise = new Promise<void>((resolve) => {
      this.endExectution = resolve
    })
  }

  /**
   * Starts processing records
   * @returns A promise that represents the completion of the entire run process
   */
  public async run() {
    for (let i = 0; i < this.MAX_CONCURRENCY; i++) {
      this.emit('startJob')
    }

    return this.endExecutionPromise
  }

  /**
   * Event handler that reads the appropriate number of records from the reader,
   * then emits a 'process' event once the requisite number of jobs are read,
   * or the reader runs out of records to read
   *
   * Emits an 'end' event if there are no more records to read
   */
  private async startJob() {
    const jobRecords: JobRecord[] = []

    for (let i = 0; i < this.handler.MAX_RECORDS_PER_JOB; i++) {
      const { value, done } = await this.reader.next()

      if (done) {
        this.emit('end')
        break
      }

      jobRecords.push(value)
    }

    if (jobRecords.length > 0) {
      const job: PendingJob = {
        records: jobRecords,
        id: randomUUID(),
        status: 'pending',
      }
      this.emit('process', job)
    }
  }

  /**
   * Processes job records using the provided job handler
   * @param job Job data
   */
  private async process(job: PendingJob) {
    const promise = this.handler.process(job)
    this.queue.push(promise)
    const result = await promise
    this.logger.log(result)
    this.queue.splice(this.queue.indexOf(result), 1)
    this.emit('startJob')
  }

  /**
   * Resolves the promise returned by the 'run' function after all jobs have completed
   */
  private async end() {
    let done = false

    while (!done) {
      if (this.endExectution && this.queue.length === 0) {
        this.endExectution()
        done = true
      }

      await this.sleep(10)
    }
  }

  /**
   * Wait for the specified number of seconds
   * @param seconds Number of seconds to sleep
   * @returns Promise that resolves after the desired number of seconds
   */
  private sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }
}
