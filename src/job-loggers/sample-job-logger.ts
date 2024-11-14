import { JobLogger } from '../components/job-logger'
import type { CompletedJob } from '../components/types'

export class SampleJobLogger extends JobLogger {
  public override log(job: CompletedJob): void {
    console.log(`${job.status}: ${job.id}, ${JSON.stringify(job.result)}`)
  }
}
