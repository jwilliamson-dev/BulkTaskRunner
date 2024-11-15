import { JobRecord } from '../components/types'

async function* SampleJobReader(
  numJobsToRead: number
): AsyncGenerator<JobRecord, void, void> {
  for (let i = 0; i < numJobsToRead; i++) {
    yield {
      number: i,
    }
  }
}

export default SampleJobReader
