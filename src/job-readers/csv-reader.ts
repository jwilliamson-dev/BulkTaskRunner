import { createReadStream, readdirSync } from 'fs'
import { sep } from 'path'
import { createInterface } from 'readline'
import { parse } from 'csv-parse/sync'

async function* CSVReader(params: CSVReaderConfig) {
  let header: null | string = null
  const filesToProcess = params.processDirectory
    ? readdirSync(params.path).map((file) => [params.path, file].join(sep))
    : [params.path]

  for (const file of filesToProcess) {
    const rl = createInterface({
      input: createReadStream(file),
      crlfDelay: Infinity,
    })

    for await (const line of rl) {
      if (!header) {
        header = line
      } else {
        const data = [header, line].join('\n')
        yield parse(data, { columns: true }) as Record<string, string>
      }
    }

    header = null
  }
}

export default CSVReader
interface CSVReaderConfig {
  processDirectory: boolean
  path: string
}
