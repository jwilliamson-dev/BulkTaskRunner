import type { CompletedJob, IJobHandler, WorkingJob } from '../components/types'

export default class SampleJobHandler implements IJobHandler {
  MAX_CONCURRENCY: number = 10
  private _params: null = null

  constructor(params: null) {
    this._params = params
  }

  processJob(job: CompletedJob | WorkingJob) {
    job.status = 'complete'
    job.result = job.data
  }
}
