import { ITerminalOptions } from 'xterm'

const options: ITerminalOptions = {
  cursorBlink: true,
  cursorStyle: 'bar',
  fontSize: 15,
  fontFamily: 'Cascadia Code',
  lineHeight: 1.1,
  letterSpacing: 1,
  convertEol: true,
  theme: {
    background: '#000000',
    foreground: '#CCCCCC',
    cursor: '#FFFFFF',
    black: '#000000',
    red: '#C50F1F',
    green: '#13A10E',
    yellow: '#C19C00',
    blue: '#0037DA',
    magenta: '#881798',
    cyan: '#3A96DD',
    white: '#CCCCCC',
    brightBlack: '#767676',
    brightRed: '#E74856',
    brightGreen: '#16C60C',
    brightYellow: '#FCE94F',
    brightBlue: '#3B78FF',
    brightMagenta: '#B4009E',
    brightCyan: '#61D6D6',
    brightWhite: '#F2F2F2'
  }
}

const breakpoint = 640
const { offsetWidth } = document.body
if (offsetWidth <= breakpoint) {
  const offset = Math.ceil((breakpoint - offsetWidth) / 60)
  options.fontSize = options.fontSize! - offset
}

export default options
