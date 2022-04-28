import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducers'
import { getTokenInfo } from '@/utils/storage'

// 参数一：reducer
// 参数二：指定store的初始值
// 参数三：指定中间件
const store = createStore(
  reducer,
  {
    // 要给哪个模块初始值
    login: getTokenInfo(),
  },
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
