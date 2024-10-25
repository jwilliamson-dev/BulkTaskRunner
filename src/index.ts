import BulkTaskRunner from './components/bulk-task-runner'
import { default as reader } from './job-readers/sample-job-reader'
import { default as handler } from './job-handlers/sample-job-handler'
import { default as logger } from './job-loggers/sample-job-logger'
import { TaskRunnerParams } from './components/types'

const params: TaskRunnerParams = {
  reader: reader(1000),
  handler: handler,
  logger: logger,
  maxConcurrency: 10,
}

const taskRunner = new BulkTaskRunner(params)

await taskRunner.run()
