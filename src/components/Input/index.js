import styles from './index.module.scss'
import classnames from 'classnames'
import { useEffect, useRef } from 'react'

export default function Input({
  extra,
  onExtraClick,
  className,
  autoFocus,
  ...rest
}) {
  const inputRef = useRef(null)
  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus()
    }
  }, [autoFocus])
  return (
    <div className={styles.root}>
      <input
        ref={inputRef}
        autoComplete="off"
        className={classnames('input', className)}
        {...rest}
      />
      {extra && (
        <div className="extra" onClick={onExtraClick}>
          {extra}
        </div>
      )}
    </div>
  )
}
