import React from 'react'
import ReactDOM from 'react-dom'

import classes from '@/utils/classes'

import './index.scss'

const prefix = 'rc-mask'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean
}

const Mask: React.FC<Props> = props => {
  const { visible, className, ...restProps } = props
  const mask = props.visible && (
    <div className={classes(prefix, className)} {...restProps}></div>
  )
  return ReactDOM.createPortal(mask, document.body)
}

export default Mask
