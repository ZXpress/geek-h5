import classNames from 'classnames'
import React, { useState, useRef, useEffect } from 'react'
import styles from './index.module.scss'

export default function TextArea({ maxLength, className, ...rest }) {
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current.focus()
    // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/setSelectionRange
    inputRef.current.setSelectionRange(-1, -1)
  }, [])
  const [value, setValue] = useState(rest.value || '')
  const handleChange = (e) => {
    setValue(e.target.value)

    rest.onChange?.(e)
  }
  return (
    <div className={styles.root}>
      {/* 文本输入框 */}
      <textarea
        ref={inputRef}
        className={classNames('textarea', className)}
        maxLength={maxLength}
        {...rest}
        value={value}
        onChange={handleChange}
      />

      {/* 当前字数/最大允许字数 */}
      <div className="count">
        {value.length}/{maxLength}
      </div>
    </div>
  )
}
