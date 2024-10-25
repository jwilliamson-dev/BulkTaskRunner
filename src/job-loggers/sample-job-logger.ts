import type { CompletedJob } from '../components/types'

const handleCompletedJob = (job: CompletedJob) => {
  console.log(`${job.status}: ${job.id}, ${JSON.stringify(job.result)}`)
}

export default handleCompletedJob
