import React, { ReactElement, useState } from 'react'
import { Dialog, Tabs, Tab } from '@akijoey/react-components'

import Terminal from '@/components/terminal'
import Form from '@/components/form'

import './index.scss'

let count = 0
const callbacks: any[] = []

const Home = (): ReactElement => {
  const [visible, setVisible] = useState(false)
  const [tabs, setTabs] = useState([] as any[])
  const [active, setActive] = useState(0)
  const handleResize = (callback: Function): void => {
    callbacks.push(callback)
  }

  const handleConfirm = (config: any): void => {
    setVisible(false)
    const newTabs = [...tabs]
    const id = (count++).toString()
    newTabs.push({
      name: 'Terminal ' + id,
      content: <Terminal id={id} config={config} onResize={handleResize} />
    })
    setTabs(newTabs)
    setActive(tabs.length)
  }

  const handleEdit = (index: number, action: string): void => {
    if (action === 'add') {
      setVisible(true)
    } else if (action === 'remove') {
      const newTabs = [...tabs]
      newTabs.splice(index, 1)
      setTabs(newTabs)
      setActive(index > 0 ? index - 1 : 0)
      callbacks.splice(index, 1)
    }
  }

  const handleChange = async (index: number): Promise<void> => {
    await setActive(index)
    callbacks[index]()
    window.onresize = callbacks[index]
  }

  return (
    <>
      <Tabs activeKey={active} onEdit={handleEdit} onChange={handleChange}>
        {tabs.map((tab: any, index: number) => (
          <Tab name={tab.name} key={index} closable>
            {tab.content}
          </Tab>
        ))}
      </Tabs>
      <Dialog
        visible={visible}
        title="Create Connection"
        onClose={() => setVisible(false)}
      >
        <Form onConfirm={handleConfirm} />
      </Dialog>
    </>
  )
}

export default Home
