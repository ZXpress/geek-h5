import { combineReducers } from 'redux'

import { login } from './login'
import { profile } from './profile'
import { search } from './search'
import { article } from './article'
import { home } from './home'

const rootReducer = combineReducers({
  login,
  profile,
  search,
  article,
  home
})

export default rootReducer
