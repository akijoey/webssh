import React, { ReactElement, useState, useEffect } from 'react'
import { Dialog, Tabs, Tab } from '@akijoey/react-components'

import Terminal, { TermInstance } from '@/components/terminal'
import Keyboard from '@/components/keyboard'
import Setting from '@/components/setting'
import Login from '@/components/login'

import { generateID } from '@/utils/identity'
import { isMobile } from '@/utils/adaptive'

import options from '@/utils/options'

import './index.scss'

const instances = new Map<string, TermInstance>()

const Home = (): ReactElement => {
  const handleInit = (instance: TermInstance): void => {
    instances.set(instance.id, instance)
    setTerm(instance.term)
  }

  const [visible, setVisible] = useState(false)
  const [tabs, setTabs] = useState([] as any[])
  const [active, setActive] = useState(0)
  const [term, setTerm] = useState(null as any)

  useEffect(() => {
    const config = { id: 'motd' }
    setTabs([{ name: 'webssh', config }])
  }, [])

  useEffect(() => {
    for (const [id] of instances) {
      if (!tabs.find(tab => tab.config.id === id)) {
        instances.delete(id)
      }
    }
    const key = tabs[active]?.config.id
    if (key !== undefined) {
      const { term, resize } = instances.get(key)!
      setTerm(term)
      term.focus()

      window.addEventListener('resize', resize)
      window.dispatchEvent(new Event('resize'))
      return () => {
        window.removeEventListener('resize', resize)
      }
    }
  }, [active, tabs])

  const handleEdit = (index: number, action: string): void => {
    if (action === 'add') {
      setVisible(true)
    } else if (action === 'remove') {
      setTabs(
        tabs.filter(tab => {
          return tab.config.id !== tabs[index].config.id
        })
      )

      if (active === index) {
        setActive(index > 0 ? index - 1 : 0)
      } else if (active > index) {
        setActive(active - 1)
      }
    }
  }

  const handleConfirm = (config: any): void => {
    const { host, username } = config
    config.id = generateID()
    setVisible(false)
    setTabs(tabs.concat({ name: `${username}@${host}`, config }))
    setActive(tabs.length)
  }

  const handleChange = (changedOptions: any): void => {
    Object.assign(options, changedOptions)
    instances.forEach(instance => {
      Object.keys(changedOptions).forEach(key => {
        instance.term.setOption(key, changedOptions[key])
      })
    })
    window.dispatchEvent(new Event('resize'))
  }

  return (
    <>
      <Setting onChange={handleChange} />
      <Tabs
        activeKey={active}
        onEdit={handleEdit}
        onChange={(index: number) => setActive(index)}
      >
        {tabs.map((tab: any) => (
          <Tab name={tab.name} key={tab.config.id} closable>
            <Terminal config={tab.config} onInit={handleInit} />
          </Tab>
        ))}
      </Tabs>
      {isMobile ? <Keyboard term={term} /> : null}
      <Dialog
        visible={visible}
        title="Connection"
        onClose={() => setVisible(false)}
      >
        <Login onConfirm={handleConfirm} />
      </Dialog>
    </>
  )
}

export default Home
