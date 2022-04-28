import Tabs from '@/components/Tabs'
import { getAllChannels, getUserChannels } from '@/store/actions/home'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import Icon from '@/components/icon'
import { Drawer } from 'antd-mobile'
import Channels from './components/Channels'
import ArticleList from './components/ArticleLIst'
import MoreAction from './components/MoreAction'

export default function Home() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserChannels())
    dispatch(getAllChannels())
  }, [dispatch])

  const tabs = useSelector((state) => state.home.userChannels)

  const [open, setOpen] = useState(false)
  const onClose = () => {
    setOpen(false)
  }

  // 控制高亮
  const [active, setActive] = useState(0)
  return (
    <div className={styles.root}>
      <Tabs
        index={active}
        tabs={tabs}
        onChange={(e) => {
          setActive(e)
        }}
      >
        {/* 放置对应数量的articlelist */}
        {tabs.map((item) => (
          <ArticleList
            key={item.id}
            channelId={item.id}
            activeId={tabs[active].id}
          ></ArticleList>
        ))}
      </Tabs>

      {/* 频道 Tab 栏右侧的两个图标按钮：搜索、频道管理 */}
      <div className="tabs-opration">
        <Icon type="iconbtn_search" />
        <Icon onClick={() => setOpen(true)} type="iconbtn_channel" />
      </div>

      {/* 频道管理组件 */}
      {/* 频道管理抽屉 */}
      <Drawer
        className="my-drawer"
        position="left"
        children={''}
        sidebar={
          open && (
            <Channels
              onClose={onClose}
              index={active}
              onChange={(e) => {
                setActive(e)
              }}
            ></Channels>
          )
        }
        open={open}
      ></Drawer>
      <MoreAction></MoreAction>
    </div>
  )
}
