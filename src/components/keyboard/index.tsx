import React, { useState, useEffect } from 'react'
import { Terminal as Term } from 'xterm'
import { Icon } from '@akijoey/react-components'

import './index.scss'

interface Props {
  term?: Term
}

interface Event {
  key: string
  keyCode: number
}

const keys = [
  { text: 'ESC', event: { key: 'Escape', keyCode: 27 } },
  { text: 'TAB', event: { key: 'Tab', keyCode: 9 } },
  { text: 'CTRL', event: { key: 'Control', keyCode: 17 } },
  { text: 'ALT', event: { key: 'Alt', keyCode: 18 } },
  { icon: 'minus', event: { key: '-', keyCode: 189 } },
  { icon: 'arrow-down', event: { key: 'ArrowDown', keyCode: 40 } },
  { icon: 'arrow-up', event: { key: 'ArrowUp', keyCode: 38 } }
]

const Keyboard: React.FC<Props> = (props: Props) => {
  const { term } = props

  const [ctrlKey, setCtrlKey] = useState(false)
  const [altKey, setAltKey] = useState(false)

  useEffect(() => {
    term?.attachCustomKeyEventHandler(event => {
      if (ctrlKey || altKey) {
        Object.defineProperty(event, 'ctrlKey', { value: ctrlKey })
        Object.defineProperty(event, 'altlKey', { value: altKey })
      }
      return true
    })
  }, [term, ctrlKey, altKey])

  const handleClick = (event: Event): void => {
    term?.focus()
    if (event.key === 'Control') {
      setCtrlKey(!ctrlKey)
      return
    }
    if (event.key === 'Alt') {
      setAltKey(!altKey)
      return
    }
    term?.textarea?.dispatchEvent(
      new KeyboardEvent('keydown', {
        ...event,
        ctrlKey,
        altKey
      })
    )
  }

  const active = (event: Event): boolean => {
    if (event.key === 'Control') {
      return ctrlKey
    }
    if (event.key === 'Alt') {
      return altKey
    }
    return false
  }

  return (
    <div className="keyboard">
      {keys.map(key => (
        <div
          key={key.event.key}
          className={active(key.event) ? 'active' : undefined}
          onClick={() => handleClick(key.event)}
        >
          {key.icon ? <Icon name={key.icon} /> : key.text}
        </div>
      ))}
    </div>
  )
}

export default Keyboard
