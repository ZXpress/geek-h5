import {
  SAVE_ALL_CHANNELS,
  SAVE_ARTICLE_LIST,
  SAVE_CHANNELS,
} from '../action_types/home'

const initValue = {
  userChannels: [],
  allChannels: [],
  // 存储文章列表
  articles: {},
  moreAction: {
    visible: false,
    articleId: '',
  },
}

export default function reducer(state = initValue, action) {
  const { type, payload } = action
  switch (type) {
    case SAVE_CHANNELS:
      return {
        ...state,
        userChannels: payload,
      }
    case SAVE_ALL_CHANNELS:
      return {
        ...state,
        allChannels: payload,
      }
    case SAVE_ARTICLE_LIST:
      // loadMore为true应该追加数据
      const oldList = state.articles[payload.channelId]?.list
      return {
        ...state,
        articles: {
          ...state.articles,
          [payload.channelId]: {
            timestamp: payload.timestamp,
            list: payload.loadMore
              ? [...oldList, ...payload.list]
              : payload.list,
          },
        },
      }
    case 'home/setMoreAction':
      return {
        ...state,
        moreAction: payload,
      }
    default:
      return state
  }
}
