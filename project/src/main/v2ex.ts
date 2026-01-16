import log from 'electron-log'

const LogTitle = '[v2ex]'

export async function onV2exBackground(): Promise<void> {
  log.info(LogTitle, 'onV2exBackground called')
}

export async function onV2exCheck(): Promise<void> {
  log.info(LogTitle, 'onV2exCheck called')
}

export async function onV2exDauResult(): Promise<void> {
  log.info(LogTitle, 'onV2exDauResult called')
}

export async function onV2exLoginStatus(): Promise<void> {
  log.info(LogTitle, 'onV2exLoginStatus called')
}
