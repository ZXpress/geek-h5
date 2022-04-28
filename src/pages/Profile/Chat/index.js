import Icon from '@/components/icon'
import Input from '@/components/input'
import NavBar from '@/components/NavBar'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import io from 'socket.io-client'
import { getTokenInfo } from '@/utils/storage'
import { Toast } from 'antd-mobile'
import { getUser } from '@/store/actions/profile'

const Chat = () => {
  // 聊天记录
  const [messageList, setMessageList] = useState([
    // 放两条初始消息
    { type: 'robot', text: '亲爱的用户您好，小智同学为您服务。' },
    { type: 'user', text: '你好' },
  ])

  // 输入框中的内容
  const [message, setMessage] = useState('')

  // 获取用户头像
  const photo = useSelector((state) => state.profile.user.photo)

  const clientRef = useRef('')

  const listRef = useRef(null)

  const dispatch = useDispatch()

  // socketio的链接
  useEffect(() => {
    // 获取用户信息
    dispatch(getUser())
    // 创建客户端实例
    // client  socketio的连接对象
    // client.close()关闭连接
    // client.on()监听事件
    // client.emit()主动向服务器发送消息
    const client = io('http://geek.itheima.net', {
      // 在查询字符串参数中传递 token
      query: {
        token: getTokenInfo().token,
      },
      transports: ['websocket'],
    })
    clientRef.current = client

    // 连接成功
    client.on('connect', function () {
      setMessageList((messageList) => {
        return [
          ...messageList,
          { type: 'robot', text: '我是小智，有什么想要问我的' },
        ]
      })
    })

    // 监听收到消息的事件
    client.on('message', (data) => {
      // 向聊天记录中添加机器人回复的消息
      setMessageList((messageList) => [
        ...messageList,
        { type: 'robot', text: data.msg },
      ])
    })

    // 清理副作用
    return () => {
      // 组件销毁的时候关闭连接
      client.close()
    }
  }, [dispatch])

  // 监听messageList变化让滚动条滚动到最底部
  useEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messageList])

  const onKeyUp = (e) => {
    if (e.keyCode !== 13) return

    // 回车时向服务器发消息
    if (!message) return
    // 显示我的消息
    setMessageList([
      ...messageList,
      {
        type: 'user',
        text: message,
      },
    ])

    // 向服务器发消息
    clientRef.current.emit('message', {
      msg: message,
      timestamp: Date.now(),
    })

    // 清空消息
    setMessage('')
  }

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="fixed-header">小智同学</NavBar>

      {/* 聊天记录列表 */}
      <div className="chat-list" ref={listRef}>
        {messageList.map((item, index) => {
          if (item.type === 'robot') {
            return (
              // 机器人的消息
              <div key={index} className="chat-item">
                <Icon type="iconbtn_xiaozhitongxue" />
                <div className="message">{item.text}</div>
              </div>
            )
          } else {
            return (
              // 用户的消息
              <div key={index} className="chat-item user">
                <img
                  src={
                    photo || 'http://toutiao.itheima.net/images/user_head.jpg'
                  }
                  alt=""
                />
                <div className="message">{item.text}</div>
              </div>
            )
          }
        })}
      </div>

      {/* 底部消息输入框 */}
      <div className="input-footer">
        <Input
          className="no-border"
          placeholder="请描述您的问题"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chat
