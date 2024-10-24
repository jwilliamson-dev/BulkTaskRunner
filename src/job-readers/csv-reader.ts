import { createReadStream, readdirSync } from 'fs'
import { sep } from 'path'
import { createInterface } from 'readline'
import { parse } from 'csv-parse/sync'
import { IJobReader } from '../components/types'

export default class CSVReader implements IJobReader {
  done: boolean = false
  private _header: string | null = null
  private _filesToProcess: string[]
  private _lineReader: AsyncGenerator<Record<string, string>, void, unknown>

  constructor(config: CSVParserConfig) {
    this._filesToProcess = config.processDirectory
      ? readdirSync(config.path).map((file) => [config.path, file].join(sep))
      : [config.path]

    if (this._filesToProcess.length === 0) {
      throw new Error('No files to process')
    }

    this._lineReader = this._getLineReader()
  }

  async readJobs(numJobsToRead: number) {
    const promises: Promise<IteratorResult<Record<string, string>, void>>[] = []

    for (let i = 0; i < numJobsToRead; i++) {
      promises.push(this._lineReader.next())
    }

    const promiseResults = await Promise.all(promises)
    const results = promiseResults.filter((v) => !v.done).map((v) => v.value)

    this.done = promiseResults.length !== results.length

    return results
  }

  private async *_getLineReader() {
    for (const file of this._filesToProcess) {
      const rl = createInterface({
        input: createReadStream(file),
        crlfDelay: Infinity,
      })

      for await (const line of rl) {
        if (!this._header) {
          this._header = line
        } else {
          const data = [this._header, line].join('\n')
          yield parse(data, { columns: true }) as Record<string, string>
        }
      }

      this._header = null
    }
  }
}

interface CSVParserConfig {
  processDirectory: boolean
  path: string
}
