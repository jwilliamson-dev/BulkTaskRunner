import { BulkTaskRunner, CSVReader } from './src'
import { SampleJobHandler } from './src/job-handlers/sample-job-handler'
import { SampleJobLogger } from './src/job-loggers/sample-job-logger'

const reader = CSVReader({ path: 'test.csv', processDirectory: false })
const handler = new SampleJobHandler()
const logger = new SampleJobLogger()

const runner = new BulkTaskRunner({
  reader,
  logger,
  handler,
  maxConcurrency: 1,
})

await runner.run()
