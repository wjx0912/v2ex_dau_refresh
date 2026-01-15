import log from 'electron-log'

const LogTitle = '[init]'

export async function electronMain(): Promise<void> {
  log.info(LogTitle, 'electronMain called')
}
