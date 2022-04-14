import React, { ReactElement, useEffect, useState } from 'react'
import { Terminal as Term } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { WebFontsAddon } from '@/utils/webfonts'

import Search from '@/components/search'
import { socket, motd } from '@/utils/connect'
import options from '@/utils/options'

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

socket.on('connected', () => {
  window.dispatchEvent(new Event('resize'))
})

const Terminal = (props: Props): ReactElement => {
  const { id } = props.config
  const tid = `terminal-${id}`

  const [visible, setVisible] = useState(false)
  const [addon, setAddon] = useState(new SearchAddon())

  useEffect(() => {
    const element = document.getElementById(tid)
    if (element !== null) {
      const term = new Term(options)
      const fitAddon = new FitAddon()
      const searchAddon = new SearchAddon()
      const webLinksAddon = new WebLinksAddon()
      const webFontsAddon = new WebFontsAddon(() => {
        term.focus()
      })

      term.loadAddon(fitAddon)
      term.loadAddon(searchAddon)
      term.loadAddon(webLinksAddon)
      term.loadAddon(webFontsAddon)
      term.open(element)

      fitAddon.fit()
      setAddon(searchAddon)

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

      // search listener (ctrl + f)
      term.onKey(({ domEvent }) => {
        const { key, ctrlKey } = domEvent
        if (ctrlKey && key === 'f') {
          setVisible(true)
        }
      })

      if (props.motd) {
        // fetch motd
        motd().then(text => {
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

  return (
    <div className="terminal" id={tid}>
      <Search
        tid={tid}
        visible={visible}
        addon={addon}
        onClose={() => setVisible(false)}
      />
    </div>
  )
}

export default Terminal
