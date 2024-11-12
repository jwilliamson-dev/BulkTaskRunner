import { JobHandler } from '../components/job-handler'
import { CompletedJob, type PendingJob } from '../components/types'

export class SampleJobHandler extends JobHandler {
  public override process(job: PendingJob): Promise<CompletedJob> {
    return new Promise<CompletedJob>((resolve) => {
      resolve({
        ...job,
        status: 'success',
        result: job.records,
      })
    })
  }
}

export default SampleJobHandler
