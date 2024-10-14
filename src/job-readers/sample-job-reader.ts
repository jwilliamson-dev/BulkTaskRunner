import type { IJobReader } from '../components/orchestrator.d'

export default class SampleJobReader implements IJobReader {
  done: boolean = false
  private _jobsRead: number = 0
  private static readonly MAX_JOBS = 100

  private increaseJobsRead() {
    this._jobsRead += 1
    this.done = this._jobsRead >= SampleJobReader.MAX_JOBS
  }

  async readJobs(
    numJobsToRead: number
  ): Promise<Record<string, string | number | object>[]> {
    const result: Record<string, string>[] = []
    for (let i = 0; i < numJobsToRead; i++) {
      if (this.done) {
        break
      }

      result.push({
        sampleData: 'sample text',
      })
      this.increaseJobsRead()
    }

    return result
  }
}
