import React from 'react'

import classes from '@/utils/classes'

import './index.scss'

const prefix = 'rc-icon'

interface Props extends React.SVGProps<SVGSVGElement> {
  name: string
}

const Icon: React.FC<Props> = props => {
  const { name, className, ...restProps } = props
  const file = `${name}.svg`
  const module = require(`@svgr/webpack?-svgo,+titleProp,+ref!@/assets/icons/${file}`)
  const Svg = module.ReactComponent
  return (
    <Svg
      className={classes(prefix, className)}
      aria-hidden="true"
      {...restProps}
    />
  )
}

export default Icon
