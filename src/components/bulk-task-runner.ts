import { EventEmitter } from 'node:events'
import { randomUUID } from 'node:crypto'
import { TaskRunnerParams, PendingJob, CompletedJob, JobData } from './types'
export default class BulkTaskRunner extends EventEmitter {
  private MAX_CONCURRENCY: number = 10
  private queue: Array<Promise<CompletedJob> | CompletedJob> = []
  private reader: AsyncGenerator<JobData, void, void>
  private handler: (job: PendingJob) => Promise<CompletedJob>
  private logger: (job: CompletedJob) => void
  private endExecutionPromise: Promise<void>
  private endExectution: ((value: void | PromiseLike<void>) => void) | null =
    null

  constructor(params: TaskRunnerParams) {
    super()
    this.reader = params.reader
    this.handler = params.handler
    this.logger = params.logger
    this.MAX_CONCURRENCY = params.maxConcurrency

    this.on('read', this.read)
    this.on('process', this.process)
    this.on('end', this.end)

    this.endExecutionPromise = new Promise<void>((resolve) => {
      this.endExectution = resolve
    })
  }

  async run() {
    for (let i = 0; i < this.MAX_CONCURRENCY; i++) {
      this.emit('read')
    }

    return this.endExecutionPromise
  }

  async read() {
    const jobData = await this.reader.next()
    if (jobData.done) {
      this.emit('end')
      return
    }

    const job: PendingJob = {
      data: jobData.value,
      id: randomUUID(),
      status: 'pending',
    }
    this.emit('process', job)
  }

  async process(job: PendingJob) {
    const promise = this.handler(job)
    this.queue.push(promise)
    const result = await promise
    this.logger(result)
    this.queue.splice(this.queue.indexOf(result), 1)
    this.emit('read')
  }

  async end() {
    if (this.endExectution && this.queue.length === 0) {
      this.endExectution()
    }

    await this.sleep(10)
  }

  sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }
}
