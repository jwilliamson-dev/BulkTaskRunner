import { JobData } from '../components/types'

async function* SampleJobReader(
  numJobsToRead: number
): AsyncGenerator<JobData, void, void> {
  for (let i = 0; i < numJobsToRead; i++) {
    yield {
      number: i,
    }
  }
}

export default SampleJobReader
