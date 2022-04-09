import React, { ReactElement, useEffect } from 'react'
import { Terminal as Term } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { io } from 'socket.io-client'

import options from '@/utils/options'
import { baseURL, fetchMotd } from '@/utils/request'

import 'xterm/css/xterm.css'
import './index.scss'

export interface TermInstance {
  id: string
  term: Term
  resize: any
}

interface Props {
  motd?: boolean
  config: { id: string }
  onInit: (instance: TermInstance) => void
}

const socket = io(baseURL)
socket.on('connected', () => {
  window.dispatchEvent(new Event('resize'))
})

const Terminal = (props: Props): ReactElement => {
  const { id } = props.config
  const tid = `terminal-${id}`
  useEffect(() => {
    const element = document.getElementById(tid)
    if (element !== null) {
      const term = new Term(options)
      const fitAddon = new FitAddon()
      const searchAddon = new SearchAddon()
      const webLinkAddon = new WebLinksAddon()
      term.loadAddon(fitAddon)
      term.loadAddon(searchAddon)
      term.loadAddon(webLinkAddon)
      term.open(element)
      fitAddon.fit()

      // resize listener
      const resize = (): void => {
        fitAddon.fit()
        !props.motd &&
          socket.emit('resize', {
            cols: term.cols,
            rows: term.rows,
            height: element.clientHeight,
            width: element.clientWidth
          })
      }
      props.onInit({ id, term, resize })

      // contextmenu listener
      const contextmenu = (event: MouseEvent): void => {
        event.preventDefault()
        const { clipboard } = navigator
        if (term.hasSelection()) {
          clipboard.writeText(term.getSelection())
          term.select(0, 0, 0)
        } else if (!props.motd) {
          clipboard.readText().then(text => {
            socket.emit(id, text)
          })
        }
      }
      element.addEventListener('contextmenu', contextmenu)

      if (props.motd) {
        // fetch motd
        fetchMotd().then(text => {
          term.write(text)
          window.dispatchEvent(new Event('resize'))
        })
      } else {
        // connect ssh
        term.onData(data => {
          socket.emit(id, data)
        })
        socket
          .on(id, (data: string) => {
            term.write(data)
          })
          .emit('shell', props.config)
      }

      return () => {
        element.removeEventListener('contextmenu', contextmenu)
      }
    }
  }, [])
  return <div className="terminal" id={tid} />
}

export default Terminal
