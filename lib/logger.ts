import Lognote from 'lognote'

const logger = new Lognote({
  preset: 'datatime'
})

const note = new Lognote({
  preset: 'foreground',
  raw: true
})

const newline = '\n'

export { logger, note, newline }
