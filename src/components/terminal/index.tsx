import React, { ReactElement, useEffect } from 'react'
import { Terminal as Term } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { io } from 'socket.io-client'

import options from '@/utils/options'

import 'xterm/css/xterm.css'
import './index.scss'

interface Props {
  id: string
  config: {}
  onResize?: any
}

const socket = io('http://localhost:8022')

const Terminal = (props: Props): ReactElement => {
  const { id, config, onResize } = props
  const tid = `terminal-${id}`
  useEffect(() => {
    const element = document.getElementById(tid)
    if (element !== null) {
      const term = new Term(options)
      term.open(element)

      // init size
      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      fitAddon.fit()

      const resize = (): void => {
        fitAddon.fit()
        socket.emit('resize', {
          cols: term.cols,
          rows: term.rows,
          height: element.clientHeight,
          width: element.clientWidth
        })
      }
      window.onresize = resize
      if (onResize !== undefined) {
        onResize(resize)
      }

      // connect ssh
      term.onData(data => {
        socket.emit(id, data)
      })
      socket
        .on(id, (data: string) => {
          term.write(data)
        })
        .on('connected', () => {
          const resize = new Event('resize')
          window.dispatchEvent(resize)
        })
        .emit('shell', { id, ...config })
    }
  }, [])
  return <div id={tid} />
}

export default Terminal
