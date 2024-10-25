import { CompletedJob, type PendingJob } from '../components/types'

const SampleJobHandler = async (job: PendingJob) => {
  return new Promise<CompletedJob>((resolve) => {
    resolve({
      ...job,
      status: 'success',
      result: job.data,
    })
  })
}

export default SampleJobHandler
