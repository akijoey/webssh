import React, { useState } from 'react'

import classes from '@/utils/classes'

import './index.scss'

const prefix = 'rc-menus'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: any
}

const Menus: React.FC<
  Props & { defaultActive?: number; activeKey?: number }
> = props => {
  const {
    defaultActive,
    activeKey,
    onSelect,
    children,
    className,
    ...restProps
  } = props
  const [active, setActive] = useState(defaultActive ?? 0)
  return (
    <nav className={classes(prefix, className)} {...restProps}>
      {React.Children.map<JSX.Element, any>(children, (element, index) => {
        return React.cloneElement(element, {
          className: classes(className, {
            [`${prefix.substr(0, 7)}-active`]: index === (activeKey ?? active)
          }),
          onClick: () => {
            setActive(index)
            onSelect?.(index)
          }
        })
      })}
    </nav>
  )
}

export const Menu: React.FC<Props> = props => {
  const { children, className, ...restProps } = props
  return (
    <div className={classes(prefix.substr(0, 7), className)} {...restProps}>
      {children}
    </div>
  )
}

export default Menus
