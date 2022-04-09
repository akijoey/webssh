import React, { ReactElement, useReducer } from 'react'
import { Button } from '@akijoey/react-components'

import options from '@/utils/options'

import './index.scss'

interface Props {
  onConfirm?: any
}

interface Options {
  [key: string]: any
}

const optionList = [
  'cursorBlink',
  'cursorStyle',
  'fontSize',
  'lineHeight',
  'letterSpacing'
]

const Option = (props: Props): ReactElement => {
  const initialState: Options = {}
  optionList.forEach(key => {
    initialState[key] = (options as Options)[key]
  })
  const [state, dispatch] = useReducer((state: any, action: any) => {
    const { name, value, checked } = action
    return { ...state, [name]: value === 'on' ? checked : value }
  }, initialState)
  const { cursorBlink, cursorStyle, fontSize, lineHeight, letterSpacing } =
    state
  const handleChange = (e: React.ChangeEvent): void => {
    dispatch(e.target)
  }

  const handleClick = (): void => {
    const changedOptions: Options = {}
    optionList.forEach(key => {
      if (state[key].length === 0) {
        return
      }
      const constructor = initialState[key].constructor
      const parsedState = constructor(state[key])
      if (Number.isNaN(parsedState)) {
        return
      }
      if (parsedState !== initialState[key]) {
        changedOptions[key] = parsedState
      }
    })
    props.onConfirm(changedOptions)
  }

  return (
    <div className="options">
      <div className="option">
        <label>Cursor Blink</label>
        <span>Whether the cursor blinks.</span>
        <input
          type="checkbox"
          id="cursorBlink"
          name="cursorBlink"
          role="switch"
          checked={cursorBlink}
          onChange={handleChange}
        />
      </div>

      <div className="option">
        <label>Cursor Style</label>
        <span>The style of the cursor.</span>
        <div className="radios">
          <input
            type="radio"
            name="cursorStyle"
            id="block"
            value="block"
            checked={cursorStyle === 'block'}
            onChange={handleChange}
          />
          <label htmlFor="block">Block</label>

          <input
            type="radio"
            name="cursorStyle"
            id="underline"
            value="underline"
            checked={cursorStyle === 'underline'}
            onChange={handleChange}
          />
          <label htmlFor="underline">Underline</label>

          <input
            type="radio"
            name="cursorStyle"
            id="bar"
            value="bar"
            checked={cursorStyle === 'bar'}
            onChange={handleChange}
          />
          <label htmlFor="bar">Bar</label>
        </div>
      </div>

      <div className="option">
        <label>Font Size</label>
        <span>The font size used to render text.</span>
        <input
          type="text"
          id="fontSize"
          name="fontSize"
          value={fontSize}
          onChange={handleChange}
        />
      </div>

      <div className="option">
        <label>Line Height</label>
        <span>The line height used to render text.</span>
        <input
          type="text"
          id="lineHeight"
          name="lineHeight"
          value={lineHeight}
          onChange={handleChange}
        />
      </div>

      <div className="option">
        <label>Letter Spacing</label>
        <span>The spacing in whole pixels between characters.</span>
        <input
          type="text"
          id="letterSpacing"
          name="letterSpacing"
          value={letterSpacing}
          onChange={handleChange}
        />
      </div>

      <Button onClick={handleClick}>Confirm</Button>
    </div>
  )
}

export default Option
