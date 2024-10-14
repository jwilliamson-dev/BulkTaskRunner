import { exit } from 'process'
import BulkTaskRunner from './components/bulk-task-runner'

const main = async (
  readerModuleName: string,
  handlerModuleName: string,
  reporterModuleName: string
) => {
  const readerModule = await import(`./job-readers/${readerModuleName}`)
  const handlerModule = await import(`./job-handlers/${handlerModuleName}`)
  const reporterModule = await import(`./job-reporters/${reporterModuleName}`)

  const orchestrator = new BulkTaskRunner(
    new readerModule.default(),
    new handlerModule.default(),
    new reporterModule.default()
  )

  await orchestrator.run()
}

if (process.argv.length < 5) {
  console.log('Too few arguments')
  exit(1)
}

await main(process.argv[2]!, process.argv[3]!, process.argv[4]!)
