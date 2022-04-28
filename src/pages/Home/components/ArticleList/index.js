import { useEffect, useState } from 'react'
import ArticleItem from '../ArticleItem'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getArticleList } from '@/store/actions/home'
import { PullToRefresh, InfiniteScroll } from 'antd-mobile-v5'

/**
 * 文章列表组件
 * @param {String} props.channelId 当前文章列表所对应的频道ID
 * @param {String} props.aid 当前 Tab 栏选中的频道ID
 */
const ArticleList = ({ channelId, activeId }) => {
  const dispatch = useDispatch()
  const current = useSelector((state) => state.home.articles[channelId])
  // 是否有更多数据
  const [hasMore, setHasMore] = useState(true)
  // 是否正在加载数据
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 如果有文章数据没必要直接发请求
    if (current) return
    if (channelId === activeId) {
      dispatch(getArticleList(channelId, Date.now()))
    }
  }, [channelId, activeId, dispatch])

  const onRefresh = async () => {
    // 下拉刷新加载最新的数据
    await dispatch(getArticleList(channelId, Date.now()))
  }

  const loadMore = async () => {
    // loading为true不加载，加载之前改为true,加载之后改为false
    if (loading) return
    // 不是当前的频道，不需要加载
    if (channelId !== activeId) return

    setLoading(true)

    try {
      if (!current.timestamp) {
        return setHasMore(false)
      }
      await dispatch(getArticleList(channelId, current.timestamp, true))
    } finally {
      setLoading(false)
    }
  }

  // 如果不是当前频道，没有文章数据，就可以先不渲染
  if (!current) return null

  return (
    <div className={styles.root}>
      <div className="articles">
        <PullToRefresh onRefresh={onRefresh}>
          {current.list.map((item) => (
            <div key={item.art_id} className="article-item">
              <ArticleItem article={item}></ArticleItem>
            </div>
          ))}
        </PullToRefresh>
        {/* 上拉加载更多 */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}></InfiniteScroll>
      </div>
    </div>
  )
}

export default ArticleList
