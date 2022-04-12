import React, { useState, useEffect, ChangeEvent, useReducer } from 'react'
import { SearchAddon, ISearchOptions } from 'xterm-addon-search'
import { Input, Icon } from '@akijoey/react-components'

import './index.scss'

interface Props {
  tid: string
  visible: boolean
  addon: SearchAddon
  onClose: any
}

const Setting: React.FC<Props> = props => {
  const { tid, visible, addon, onClose } = props

  const initOptions: ISearchOptions = {
    caseSensitive: false,
    wholeWord: false,
    regex: false
  }
  const [options, dispatch] = useReducer((state: any, action: any) => {
    if (action === 'clear') {
      return initOptions
    }
    return { ...state, [action]: !state[action] }
  }, initOptions)
  useEffect(() => {
    search && addon.findNext(search, options)
  }, [options])

  const [search, setSearch] = useState('')
  const searchNext = (text: string) => {
    setSearch(text)
    addon.findNext(text, { ...options, incremental: true })
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    searchNext(event.target.value)
  }
  const handleClose = () => {
    searchNext('')
    dispatch('clear')
    onClose()
  }

  const findNext = () => addon.findNext(search, options)
  const findPrev = () => addon.findPrevious(search, options)

  useEffect(() => {
    if (visible) {
      const selectors = `#${tid} .search input`
      const element = document.querySelector(selectors)
      element && (element as HTMLInputElement).focus()
    } else {
      const term = (addon as any)._terminal
      term && term.focus()
    }
  }, [visible])

  return visible ? (
    <div className="search">
      <Input
        value={search}
        onChange={handleChange}
        placeholder="Search"
        icon="search"
      />

      <a
        title="Match Case"
        className={options.caseSensitive ? 'active' : undefined}
      >
        <Icon name="case" onClick={() => dispatch('caseSensitive')} />
      </a>
      <a
        title="Match Whole Word"
        className={options.wholeWord ? 'active' : undefined}
      >
        <Icon name="whole-word" onClick={() => dispatch('wholeWord')} />
      </a>
      <a
        title="Use Regular Expression"
        className={options.regex ? 'active' : undefined}
      >
        <Icon name="regexp" onClick={() => dispatch('regex')} />
      </a>

      <Icon name="arrow-up" onClick={findPrev} />
      <Icon name="arrow-down" onClick={findNext} />
      <Icon name="close" onClick={handleClose} />
    </div>
  ) : null
}

export default Setting
