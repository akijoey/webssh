import { Terminal, ITerminalAddon } from 'xterm'

declare module 'xterm-addon-web-fonts' {
  export class WebFontsAddon implements ITerminalAddon {
    constructor()

    public activate(terminal: Terminal): void

    public dispose(): void
  }
}
