import React, { ReactElement, useReducer } from 'react'
import { Button, Input } from '@akijoey/react-components'

import './index.scss'

interface Props {
  onConfirm?: any
}

const Form = (props: Props): ReactElement => {
  const initialState = {
    host: '',
    port: '',
    username: '',
    password: ''
  }
  const [state, dispatch] = useReducer((state: any, action: any) => {
    const { name, value } = action
    return { ...state, [name]: value }
  }, initialState)
  const { host, port, username, password } = state
  const handleChange = (e: React.ChangeEvent): void => {
    dispatch(e.target)
  }
  const handleClick = (): void => props.onConfirm(state)
  return (
    <div className="form">
      <div className="socket">
        <Input
          name="host"
          value={host}
          onChange={handleChange}
          placeholder="Host"
          icon="host"
        />
        :
        <Input
          name="port"
          value={port}
          onChange={handleChange}
          placeholder="Port"
        />
      </div>
      <Input
        name="username"
        value={username}
        onChange={handleChange}
        placeholder="Username"
        icon="user"
      />
      <Input
        name="password"
        value={password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
        icon="password"
      />
      <Button onClick={handleClick}>Confirm</Button>
    </div>
  )
}

export default Form
