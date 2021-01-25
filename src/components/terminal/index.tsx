import React, { ReactElement, useEffect } from 'react'
import { Terminal as Term } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { io } from 'socket.io-client'

import options from '@/utils/options'

import 'xterm/css/xterm.css'
import './index.scss'

const socket = io('http://localhost:8022')

interface Props {
  id: string
  config: {}
}

const Terminal = (props: Props): ReactElement => {
  const { id, config } = props
  const tid = `terminal-${id}`
  useEffect(() => {
    const element = document.getElementById(tid)!
    const term = new Term(options)
    term.open(element)
    // init size
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    fitAddon.fit()
    socket.emit('initsize', term.cols, term.rows)
    window.addEventListener('resize', () => {
      fitAddon.fit()
      socket.emit('resize', {
        cols: term.cols,
        rows: term.rows,
        height: element.clientHeight,
        width: element.clientWidth
      })
    })
    // connect ssh
    socket.emit('connected', { id, ...config })
    socket.on(id, (data: string) => {
      term.write(data)
    })
    term.onData(data => {
      socket.emit(id, data)
    })
  }, [])
  return <div id={tid}></div>
}

export default Terminal
