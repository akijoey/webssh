import React, { ReactElement, useState, useEffect } from 'react'
import { Dialog, Tabs, Tab } from '@akijoey/react-components'

import Terminal, { TermInstance } from '@/components/terminal'
import Setting from '@/components/setting'
import Login from '@/components/login'
import { generateID } from '@/utils/identity'

import options from '@/utils/options'

import './index.scss'

const instances = new Map<string, TermInstance>()

const Home = (): ReactElement => {
  const handleInit = (instance: TermInstance): void => {
    instances.set(instance.id, instance)
  }

  const [visible, setVisible] = useState(false)
  const [tabs, setTabs] = useState([] as any[])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const config = { id: 'motd' }
    const content = <Terminal config={config} onInit={handleInit} motd />
    setTabs([{ ...config, name: 'webssh', content }])
  }, [])

  useEffect(() => {
    for (const [id] of instances) {
      if (!tabs.find(tab => tab.id === id)) {
        instances.delete(id)
      }
    }
    const key = tabs[active]?.id
    if (key !== undefined) {
      const { resize } = instances.get(key)!
      window.addEventListener('resize', resize)
      window.dispatchEvent(new Event('resize'))
    }
    return () => {
      if (key !== undefined) {
        const { resize } = instances.get(key)!
        window.removeEventListener('resize', resize)
      }
    }
  }, [active, tabs])

  const handleEdit = (index: number, action: string): void => {
    if (action === 'add') {
      setVisible(true)
    } else if (action === 'remove') {
      setTabs(tabs.filter(tab => tab.id !== tabs[index].id))
      setActive(index > 0 ? index - 1 : 0)
    }
  }

  const handleConfirm = (config: any): void => {
    const { host, username } = config
    config.id = generateID()
    setVisible(false)
    setTabs(
      tabs.concat({
        id: config.id,
        name: `${username}@${host}`,
        content: <Terminal config={config} onInit={handleInit} />
      })
    )
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
          <Tab name={tab.name} key={tab.id} closable>
            {tab.content}
          </Tab>
        ))}
      </Tabs>
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
