import log from 'electron-log'

const LogTitle = '[init]'

export async function initConfig(): Promise<void> {
  log.info(LogTitle, 'initConfig called')
}
