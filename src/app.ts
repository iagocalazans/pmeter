/* eslint-disable no-undef */
import {
  PerformanceObserver,
  performance
} from 'perf_hooks'
import chalk from 'chalk'
import Server from './types/server'

const log = console.log

const fnArr: Server[] = []

const observer = new PerformanceObserver((list, obs) => {
  const entries = list.getEntries()
  entries.map((value) => {
    const server = fnArr.find((s) => s.function === value.name)

    if (!server) return value

    log(`\n\n${chalk.bgWhiteBright(chalk.black(' FUNCTION '))}${chalk.bgCyanBright(chalk.black(` ${server.function} `))}`)
    log(`\n${chalk.bgYellow(chalk.black(' SERVER USAGE '))}\n`)
    log(`[${Math.round(server.cpu) > 80 ? chalk.redBright('CPU') : chalk.greenBright('CPU')}] ${server.cpu}%`)
    log(`[${chalk.yellow('RAM')}] ${server.ram < 0 ? 0 : server.ram} MB`)
    log(`[${chalk.yellow('RSS')}] ${server.rss < 0 ? 0 : server.rss} MB`)
    log(`[${chalk.yellow('EXT')}] ${server.ext < 0 ? 0 : server.ext} MB`)
    log(`[${chalk.yellow('BUFFER')}] ${server.buffer < 0 ? 0 : server.buffer} MB`)
    log(`\n${chalk.bgGreen(chalk.black(' PERFORMANCE '))}\n`)
    log(`[${chalk.green('EXEC TIME')}] ${Math.floor(value.duration)}ms`)
    log(`\n${chalk.bgRedBright(chalk.black(' CLOSE '))}\n`)

    return value
  })
})

observer.observe({ entryTypes: ['measure'], buffered: true })

const pmbind = (fn: Function, ...params: any[]) => {
  const startDate = Date.now()
  const beforeMemUsage: NodeJS.MemoryUsage = process.memoryUsage()
  const before = process.cpuUsage()

  performance.mark('Init')
  const res = fn(params)
  performance.mark('End')
  performance.measure(fn.name, 'Init', 'End')

  const after = process.cpuUsage(before)
  const afterMemUsage: NodeJS.MemoryUsage = process.memoryUsage()
  const usage = (afterMemUsage.heapUsed - beforeMemUsage.heapUsed) / 1024 / 1024
  const rss = (afterMemUsage.rss - beforeMemUsage.rss) / 1024 / 1024
  const ext = (afterMemUsage.external - beforeMemUsage.external) / 1024 / 1024
  const buffer = (afterMemUsage.arrayBuffers - beforeMemUsage.arrayBuffers) / 1024 / 1024
  const cpu = (100 * after.user / ((Date.now() - startDate) * 1000))
  const cpuUsage = cpu > 100 ? cpu - 100 : typeof cpu !== 'number' ? 0 : cpu
  const extRes = Math.round(ext * 100) / 100
  const bufferRes = Math.round(buffer * 100) / 100

  const server: Server = {
    function: fn.name,
    cpu: cpuUsage > 100 ? 100 : Math.round(cpuUsage),
    ram: Math.round(usage * 100) / 100,
    rss: Math.round(rss * 100) / 100,
    ext: extRes,
    buffer: bufferRes
  }

  fnArr.push(server)
  return res
}

export { pmbind }
