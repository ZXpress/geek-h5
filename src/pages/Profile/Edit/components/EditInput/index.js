import React, { useState } from 'react'
import styles from './index.module.scss'
import NavBar from '@/components/NavBar'
import TextArea from '@/components/TextArea'
import Input from '@/components/input'
import { useSelector } from 'react-redux'

export default function EditInput({ onClose, type, onCommit }) {
  const defaultValue = useSelector((state) => state.profile.profile[type])
  // console.log(defaultValue)
  const [value, setValue] = useState(defaultValue || '')
  return (
    <div className={styles.root}>
      <NavBar
        onLeftClick={onClose}
        extra={
          <span className="commit-btn" onClick={() => onCommit(type, value)}>
            提交
          </span>
        }
      >
        编辑{type === 'name' ? '昵称' : '简介'}
      </NavBar>
      <div className="content-box">
        <h3>{type === 'name' ? '昵称' : '简介'}</h3>

        {/* 回显内容 */}
        {type === 'name' ? (
          <Input
            className="input-wrap"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          ></Input>
        ) : (
          <TextArea
            maxLength={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></TextArea>
        )}
      </div>
    </div>
  )
}
