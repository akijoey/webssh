import React, { ReactElement, useState, Fragment } from 'react'

import Terminal from '@/components/terminal'
import Dialog from '@/components/dialog'
import Form from '@/components/form'
import Tabs, { Tab } from '@/components/tabs'

import './index.scss'

let count = 0

const Home = (): ReactElement => {
  const [visible, setVisible] = useState(false)
  const [tabs, setTabs] = useState([] as any[])
  const [active, setActive] = useState(0)
  const handleConfirm = (config: any): void => {
    setVisible(false)
    const newTabs = [...tabs]
    const id = (count++).toString()
    newTabs.push({
      name: 'Terminal ' + id,
      content: <Terminal id={id} config={config} />
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
    }
  }
  return (
    <Fragment>
      <Tabs
        activeKey={active}
        onEdit={handleEdit}
        onChange={(index: number) => setActive(index)}
      >
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
    </Fragment>
  )
}

export default Home
