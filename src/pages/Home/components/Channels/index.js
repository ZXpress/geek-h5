import Icon from '@/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
// import { differenceBy } from 'lodash'
// 按需导入
import differenceBy from 'lodash/differenceBy'
import classNames from 'classnames'
import { useState } from 'react'
import { addChannel, delChannel } from '@/store/actions/home'
import { Toast } from 'antd-mobile'

/**
 * 频道管理组件
 * @param {Number} props.tabActiveIndex 用户选中的频道的索引
 * @param {Function} props.onClose 关闭频道管理抽屉时的回调函数
 * @param {Function} props.onChannelClick 当点击频道列表中的某个频道时的会带哦函数
 */
const Channels = ({
  tabActiveIndex,
  onClose,
  onChannelClick,
  index,
  onChange,
}) => {
  const userChannels = useSelector((state) => state.home.userChannels)
  const recommendChannels = useSelector((state) => {
    const { userChannels, allChannels } = state.home
    // return allChannels.filter((item) => {
    //   if (userChannels.findIndex((v) => v.id === item.id) === -1) {
    //     return true
    //   } else {
    //     return false
    //   }
    // })
    return differenceBy(allChannels, userChannels, 'id')
  })

  const changeChannel = (i) => {
    // 如果是编辑状态不跳转
    if (editing) return

    onChange(i)
    onClose()
  }

  const dispatch = useDispatch()

  // 删除频道
  const del = (channel, i) => {
    if (userChannels.length <= 4) {
      Toast.info('至少保留4个频道')
      return
    }
    dispatch(delChannel(channel))

    // 高亮处理
    // 删除的 i 小于index，让 i-1 高亮
    if (i < index) {
      onChange(index - 1)
    } else {
      onChange(index)
    }
  }

  // 处理编辑状态
  const [editing, setEditing] = useState(false)

  const add = async (channel) => {
    await dispatch(addChannel(channel))
    Toast.success('添加成功', 1)
  }
  return (
    <div className={styles.root}>
      {/* 顶部栏：带关闭按钮 */}
      <div className="channel-header">
        <Icon type="iconbtn_channel_close" onClick={onClose} />
      </div>

      {/* 频道列表 */}
      <div className="channel-content">
        {/* 当前已选择的频道列表 */}
        <div className={classNames('channel-item', editing ? 'edit' : '')}>
          <div className="channel-item-header">
            <span className="channel-item-title">我的频道</span>
            <span className="channel-item-title-extra">
              {editing ? '点击删除频道' : '点击进入频道'}
            </span>
            <span
              className="channel-item-edit"
              onClick={() => setEditing(!editing)}
            >
              {editing ? '完成' : '编辑'}
            </span>
          </div>

          <div className="channel-list">
            {userChannels.map((item, i) => (
              <span
                key={item.id}
                className={classNames(
                  'channel-list-item',
                  index === i ? 'selected' : ''
                )}
                onClick={() => changeChannel(i)}
              >
                {item.name}
                {/* 推荐不允许删除 */}
                {item.id !== 0 && i !== index && (
                  <Icon
                    type="iconbtn_tag_close"
                    onClick={() => del(item, i)}
                  ></Icon>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 推荐的频道列表 */}
        <div className="channel-item">
          <div className="channel-item-header">
            <span className="channel-item-title">频道推荐</span>
            <span className="channel-item-title-extra">点击添加频道</span>
          </div>
          <div className="channel-list">
            {recommendChannels.map((item) => (
              <span
                key={item.id}
                className="channel-list-item"
                onClick={() => add(item)}
              >
                + {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Channels
