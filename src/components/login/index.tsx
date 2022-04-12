import React, { ReactElement, useReducer } from 'react'
import { Button, Input } from '@akijoey/react-components'

import './index.scss'

interface Props {
  onConfirm?: any
}

interface Config {
  [key: string]: any
}

const Login = (props: Props): ReactElement => {
  const initialState = {
    host: '',
    port: '',
    username: '',
    password: '',
    privateKey: null,
    passphrase: '',
    auth: 'password'
  }
  const [state, dispatch] = useReducer((state: any, action: any) => {
    if (action === 'clear') {
      return initialState
    }
    const { name, value, files } = action
    return { ...state, [name]: files ? files[0] : value }
  }, initialState)
  const { host, port, username, auth, password, privateKey, passphrase } = state
  const handleChange = (e: React.ChangeEvent): void => {
    dispatch(e.target)
  }

  const handleClick = (): void => {
    const config: Config = { host, port, username }
    if (auth === 'password') {
      config.password = password
    } else if (auth === 'privateKey') {
      config.privateKey = privateKey
      if (passphrase.length > 0) {
        config.passphrase = passphrase
      }
    }
    props.onConfirm(config)
    dispatch('clear')
  }

  return (
    <div className="login">
      <div className="config">
        <label>Hostname</label>
        <span>The hostname or IP address of the server.</span>
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
      </div>

      <div className="config">
        <label>Username</label>
        <span>The username for authentication.</span>
        <Input
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="Username"
          icon="user"
        />
      </div>

      <div className="config">
        <label>Authentication</label>
        <span>The method of the authentication.</span>
        <div className="radios">
          <input
            type="radio"
            name="auth"
            id="password"
            value="password"
            checked={auth === 'password'}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>

          <input
            type="radio"
            name="auth"
            id="privateKey"
            value="privateKey"
            checked={auth === 'privateKey'}
            onChange={handleChange}
          />
          <label htmlFor="privateKey">Private Key</label>

          <input
            type="radio"
            name="auth"
            id="none"
            value="none"
            checked={auth === 'none'}
            onChange={handleChange}
          />
          <label htmlFor="none">None</label>
        </div>
      </div>

      {auth === 'password' && (
        <div className="config">
          <label>Password</label>
          <span>The password for password-based user authentication.</span>
          <Input
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            icon="password"
          />
        </div>
      )}

      {auth === 'privateKey' && (
        <>
          <div className="config">
            <label>Private Key</label>
            <span>
              The private key for either key-based or hostbased user
              authentication.
            </span>
            <input type="file" name="privateKey" onChange={handleChange} />
          </div>
          <div className="config">
            <label>Passphrase</label>
            <span>
              The passphrase used to decrypt private key. (Empty for no
              passphrase)
            </span>
            <Input
              name="passphrase"
              value={passphrase}
              onChange={handleChange}
              placeholder="Passphrase"
              type="password"
              icon="password"
            />
          </div>
        </>
      )}

      <Button onClick={handleClick}>Confirm</Button>
    </div>
  )
}

export default Login
