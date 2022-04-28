import styles from './index.module.scss'
import Icon from '@/components/icon'
import { withRouter, useHistory } from 'react-router-dom'
import classNames from 'classnames'

// 通过路由配置的路由组件才有history、location、match
// 解决：
//   1.通过withRouter高阶组件增强后导出
//   2.使用路由相关的hook  useHistory useLocation useParams
function NavBar({ children, extra, onLeftClick, className }) {
  const history = useHistory()
  const back = () => {
    // 回到上一页
    if (onLeftClick) {
      onLeftClick()
    } else {
      history.goBack()
    }
  }
  return (
    <div>
      {/* 顶部工具栏 */}
      <div className={classNames(styles.root, className)}>
        {/* 后退按钮 */}
        <div className="left">
          <Icon type="iconfanhui" onClick={back} />
        </div>
        {/* 居中标题 */}
        <div className="title">{children}</div>

        {/* 右侧内容 */}
        <div className="right">{extra}</div>
      </div>
    </div>
  )
}

export default withRouter(NavBar)
