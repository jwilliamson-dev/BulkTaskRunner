import type { IJobHandler, Job } from '../components/types'

export default class SampleJobHandler implements IJobHandler {
  MAX_CONCURRENCY: number = 10

  processJob(job: Job) {
    console.log('Handled job: ', job.id)
    job.status = 'complete'
  }
}
