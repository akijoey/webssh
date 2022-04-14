import { Terminal, ITerminalAddon } from 'xterm'
import FontFaceObserver from 'fontfaceobserver'

const defaultFont = 'monospace'

const isSupport = (font: string) => {
  if (font.toLowerCase() === defaultFont) {
    return true
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    return false
  }

  const size = 10
  const text = 'a'

  canvas.width = size
  canvas.height = size
  context.textAlign = 'center'
  context.fillStyle = 'black'
  context.textBaseline = 'middle'

  const fontData = (font?: string) => {
    context.clearRect(0, 0, size, size)
    context.font = `${size}px ${[font]
      .filter(Boolean)
      .concat(defaultFont)
      .join(', ')}`
    context.fillText(text, size / 2, size / 2)
    return [].slice
      .call(context.getImageData(0, 0, size, size).data)
      .filter(val => val !== 0)
      .join('')
  }

  return fontData(font) !== fontData()
}

export class WebFontsAddon implements ITerminalAddon {
  private _terminal?: Terminal
  private _open?: (parent: HTMLElement) => void
  private _callback?: () => void

  constructor(callback?: () => void) {
    this._callback = callback
  }

  public activate(terminal: Terminal): void {
    this._terminal = terminal
    this._open = terminal.open
    const addon = this

    terminal.open = function (parent: HTMLElement) {
      const webFonts = this.getOption('fontFamily')
        .split(',')
        .map(font => font.trim())

      for (const font of webFonts) {
        if (isSupport(font)) {
          addon._execOpen(parent)
          return
        }
      }

      addon._loadFontFace(webFonts, parent)
    }
  }

  public dispose(): void {
    if (this._terminal && this._open) {
      this._terminal.open = this._open
    }
  }

  private _loadFontFace(webFonts: string[], parent: HTMLElement) {
    const font = webFonts.shift()

    if (!font) {
      return
    }

    Promise.all([
      new FontFaceObserver(font).load(),
      new FontFaceObserver(font, { weight: 'bold' }).load()
    ])
      .then(() => {
        this._execOpen(parent)
      })
      .catch(() => {
        if (webFonts.length > 0) {
          this._loadFontFace(webFonts, parent)
        } else {
          this._terminal && this._terminal.setOption('fontFamily', defaultFont)
          this._execOpen(parent)
        }
      })
  }

  private _execOpen(parent: HTMLElement) {
    this._open && this._open.call(this._terminal, parent)
    this._callback && this._callback()
  }
}
