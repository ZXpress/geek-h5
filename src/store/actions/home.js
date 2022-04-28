import request from '@/utils/request'
import { getLocalChannels, hasToken, setLocalChannels } from '@/utils/storage'
import {
  SAVE_ALL_CHANNELS,
  SAVE_ARTICLE_LIST,
  SAVE_CHANNELS,
} from '../action_types/home'

// 获取用户频道
export const getUserChannels = () => {
  return async (dispatch) => {
    // 判断用户是否登录
    if (hasToken()) {
      // 请求数据
      const res = await request.get('/user/channels')
      // 将频道数据保存到 Redux
      dispatch(saveUserChannels(res.data.channels))
    } else {
      // 没有登录本地获取频道数据
      const channels = getLocalChannels()
      if (channels) {
        // 有数据
        dispatch(saveUserChannels(channels))
      } else {
        // 没有数据
        // 请求数据
        const res = await request.get('/user/channels')
        // 将频道数据保存到 Redux
        dispatch(saveUserChannels(res.data.channels))
        // 保存到本地
        setLocalChannels(res.data.channels)
      }
    }
  }
}

// 保存用户频道
export const saveUserChannels = (payload) => {
  return {
    type: SAVE_CHANNELS,
    payload,
  }
}

// 获取所有频道
export const getAllChannels = () => {
  return async (dispatch) => {
    // 请求数据
    const res = await request.get('/channels')
    dispatch(saveAllChannels(res.data.channels))
  }
}

// 保存所有频道
export const saveAllChannels = (payload) => {
  return {
    type: SAVE_ALL_CHANNELS,
    payload,
  }
}

// 删除频道
export const delChannel = (channel) => {
  // 如果用户登录，发请求删除
  // 没有登录，删除本地频道
  // 最终修改redux中频道
  return async (dispatch, getState) => {
    // getState获取redux数据
    const userChannels = getState().home.userChannels
    if (hasToken()) {
      await request({
        method: 'delete',
        url: `/user/channels/${channel.id}`,
      })
      // 保存频道数据到redux
      dispatch(
        saveUserChannels(userChannels.filter((item) => item.id !== channel.id))
      )
    } else {
      // 没有登录
      // 修改本地和redux
      const result = userChannels.filter((item) => item.id !== channel.id)
      dispatch(saveUserChannels(result))
      setLocalChannels(result)
    }
  }
}

// 添加频道
export const addChannel = (channel) => {
  return async (dispatch, getState) => {
    const channels = [...getState().home.userChannels, channel]
    if (hasToken()) {
      await request({
        method: 'patch',
        url: '/user/channels',
        data: {
          channels: [channel],
        },
      })
      dispatch(saveUserChannels(channels))
    } else {
      dispatch(saveUserChannels(channels))
      setLocalChannels(channels)
    }
  }
}

// 获取文章列表数据
export const getArticleList = (channelId, timestamp, loadMore = false) => {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/articles',
      params: {
        channel_id: channelId,
        timestamp: timestamp,
      },
    })
    dispatch(
      setArticleList({
        channelId,
        timestamp: res.data.pre_timestamp,
        list: res.data.results,
        loadMore,
      })
    )
  }
}

export const setArticleList = (payload) => {
  return {
    type: SAVE_ARTICLE_LIST,
    payload,
  }
}

export const setMoreAction = (payload) => {
  return {
    type: 'home/setMoreAction',
    payload,
  }
}

export const unLikeArticle = (articleId) => {
  return async (dispatch, getState) => {
    await request({
      method: 'post',
      url: '/article/dislikes',
      data: {
        target: articleId,
      },
    })
  }
}
