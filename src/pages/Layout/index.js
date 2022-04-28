import React, { Suspense } from 'react'
import styles from './index.module.scss'
import Icon from '@/components/icon'
import { useHistory, useLocation, Switch, Route } from 'react-router-dom'
import classnames from 'classnames'
import AuthRoute from '@/components/AuthRoute'
// 按需导入(路由懒加载)  需要配合Suspense使用
const Home = React.lazy(() => import('@/pages/Home'))
const QA = React.lazy(() => import('@/pages/QA'))
const Video = React.lazy(() => import('@/pages/Video'))
const Profile = React.lazy(() => import('@/pages/Profile'))

const tabBar = [
  { id: 1, title: '首页', to: '/home', icon: 'iconbtn_home' },
  { id: 2, title: '问答', to: '/home/question', icon: 'iconbtn_qa' },
  { id: 3, title: '视频', to: '/home/video', icon: 'iconbtn_video' },
  { id: 4, title: '我的', to: '/home/profile', icon: 'iconbtn_mine' },
]

export default function Layout() {
  const history = useHistory()
  const location = useLocation()

  return (
    <div className={styles.root}>
      {/* 区域一：点击按钮切换显示内容的区域 */}
      <div className="tab-content">
        {/* 配置二级路由 */}
        <Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route exact path="/home" component={Home}></Route>
            <Route path="/home/question" component={QA}></Route>
            <Route path="/home/video" component={Video}></Route>

            <AuthRoute path="/home/profile" component={Profile}></AuthRoute>
          </Switch>
        </Suspense>
      </div>
      {/* 区域二：按钮区域，会使用固定定位显示在页面底部 */}
      <div className="tabbar">
        {tabBar.map((item) => (
          <div
            className={classnames(
              'tabbar-item',
              location.pathname === item.to ? 'tabbar-item-active' : ''
            )}
            key={item.id}
            onClick={() => history.push(item.to)}
          >
            <Icon
              type={
                location.pathname === item.to ? `${item.icon}_sel` : item.icon
              }
            />
            <span>{item.title}</span>
          </div>
        ))}
        {/* <div className="tabbar-item">
          <Icon type="iconbtn_qa" />
          <span>问答</span>
        </div>
        <div className="tabbar-item">
          <Icon type="iconbtn_video" />
          <span>视频</span>
        </div>
        <div className="tabbar-item">
          <Icon type="iconbtn_mine" />
          <span>我的</span>
        </div> */}
      </div>
    </div>
  )
}
