import type {
  CompletedJob,
  IJobHandler,
  IJobReader,
  IJobLogger,
  PendingJob,
  WorkingJob,
} from './types'

export default class BulkTaskRunner {
  private jobReader: IJobReader
  private readingComplete: boolean = false
  private jobHandler: IJobHandler
  private jobLogger: IJobLogger
  private pendingQueue: Array<PendingJob> = []
  private workingQueue: Array<WorkingJob | CompletedJob> = []
  private MAX_WORKING_QUEUE: number

  private readonly MAX_PENDING_QUEUE = 1000

  constructor(reader: IJobReader, handler: IJobHandler, logger: IJobLogger) {
    this.jobHandler = handler
    this.MAX_WORKING_QUEUE = handler.MAX_CONCURRENCY
    this.jobReader = reader
    this.jobLogger = logger
  }

  async run() {
    const promises = [this.readJobs(), this.handleJobs()]
    await Promise.all(promises)
  }

  async readJobs() {
    while (!this.jobReader.done) {
      const numJobs = this.MAX_PENDING_QUEUE - this.workingQueue.length

      if (numJobs === 0) {
        await this.sleep(60)
        continue
      }

      const jobsRead = await this.jobReader.readJobs(numJobs)
      if (jobsRead.length === 0) {
        await this.sleep(60)
        continue
      }

      const now = new Date().toISOString()
      const jobs = jobsRead.map((jobData) => {
        return {
          status: 'pending' as const,
          createdAt: now,
          data: jobData,
          id: crypto.randomUUID(),
        }
      })
      this.pendingQueue.push(...jobs)
    }
    this.readingComplete = true
  }

  async handleJobs() {
    await this.sleep(5)

    while (
      this.pendingQueue.length > 0 ||
      !this.readingComplete ||
      this.workingQueue.length > 0
    ) {
      // Clear out completed jobs
      const workingJobs: WorkingJob[] = []
      this.workingQueue.forEach((job) => {
        if (job.status === 'working') {
          workingJobs.push(job)
        } else {
          this.jobLogger.handleCompletedJob(job)
        }
      })
      this.workingQueue = workingJobs

      // If working queue is maxed out or if there are no jobs in the pending queue, wait and continue
      if (
        this.workingQueue.length === this.MAX_WORKING_QUEUE ||
        this.pendingQueue.length === 0
      ) {
        await this.sleep(10)
        continue
      }

      // Move jobs from pending queue to working queue
      const numJobs = this.MAX_WORKING_QUEUE - this.workingQueue.length
      const jobsToStart = this.pendingQueue.splice(0, numJobs).map((job) => {
        const jobToStart = { ...job, status: 'working' as const }
        this.jobHandler.processJob(jobToStart)
        return jobToStart
      })

      this.workingQueue.push(...jobsToStart)

      // Wait 10s
      await this.sleep(10)
    }
  }

  sleep(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }
}
