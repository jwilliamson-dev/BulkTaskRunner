import BulkTaskRunner from './components/bulk-task-runner'
import { default as Reader } from './job-readers/csv-reader'
import { default as Handler } from './job-handlers/sample-job-handler'
import { default as Logger } from './job-loggers/sample-job-logger'

const readerSettings = { processDirectory: true, path: './sampledata' }
const handlerSettings = null
const loggerSettings = null

const main = async () => {
  const orchestrator = new BulkTaskRunner(
    new Reader(readerSettings),
    new Handler(handlerSettings),
    new Logger(loggerSettings)
  )

  await orchestrator.run()
}

await main()
