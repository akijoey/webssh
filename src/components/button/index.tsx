import React from 'react'

import classes from '@/utils/classes'

import './index.scss'

const prefix = 'rc-button'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<Props> = props => {
  const { children, className, ...restProps } = props
  return (
    <button className={classes(prefix, className)} {...restProps}>
      {children}
    </button>
  )
}

export default Button
