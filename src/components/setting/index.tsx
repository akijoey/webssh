import React, { ReactElement, useState } from 'react'
import { Dialog, Icon } from '@akijoey/react-components'

import Option from '@/components/option'

import './index.scss'

interface Props {
  onChange?: any
}

const Setting = (props: Props): ReactElement => {
  const [visible, setVisible] = useState(false)
  const handleConfirm = (option: any): void => {
    setVisible(false)
    props.onChange(option)
  }
  return (
    <>
      <div className="setting" onClick={() => setVisible(true)}>
        <Icon name="setting" />
      </div>
      <Dialog
        visible={visible}
        title="Preferences"
        onClose={() => setVisible(false)}
      >
        <Option onConfirm={handleConfirm} />
      </Dialog>
    </>
  )
}

export default Setting
