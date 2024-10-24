import type { CompletedJob, IJobLogger } from '../components/types'

export default class SampleJobLogger implements IJobLogger {
  private _params: null = null

  constructor(params: null) {
    this._params = params
  }

  handleCompletedJob(job: CompletedJob): void {
    let msg = ''
    if (job.status === 'complete') {
      msg += 'Success: '
    } else {
      msg += 'Fail: '
    }

    console.log(msg, job.id, job.result)
  }
}
