import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import classes from '@/utils/classes'
import Icon from '@/components/icon'
import Mask from '@/components/mask'

import './index.scss'

const prefix = 'rc-dialog'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean
  title?: string
  onClose?: any
}

const Dialog: React.FC<Props> = props => {
  const { visible, children, title, onClose, className, ...restProps } = props
  const dialog = visible ? (
    <Fragment>
      <Mask visible={visible} onClick={onClose} />
      <div className={classes(prefix, className)} {...restProps}>
        <header>
          {title !== undefined && <h1>{title}</h1>}
          <Icon name="close" onClick={onClose} />
        </header>
        {children}
      </div>
    </Fragment>
  ) : null
  return ReactDOM.createPortal(dialog, document.body)
}

export default Dialog
