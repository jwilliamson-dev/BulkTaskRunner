import type { CompletedJob, IJobReporter } from '../components/orchestrator.d'

export default class SampleJobReporter implements IJobReporter {
  handleCompletedJob(job: CompletedJob): void {
    let msg = ''
    if (job.status === 'complete') {
      msg += 'Success: '
    } else {
      msg += 'Fail: '
    }

    console.log(msg, job.id)
  }
}
