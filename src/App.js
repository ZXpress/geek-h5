import { Router, Route, Switch, Redirect } from 'react-router-dom'

import { history } from '@/utils/history'

import Login from './pages/Login'
import Layout from './pages/Layout'
import Search from './pages/Search'
import Article from './pages/Article'
import SearchResult from './pages/Search/Result'
import ProfileEdit from './pages/Profile/Edit'
import ProfileFeedback from './pages/Profile/Feedback'
import Chat from './pages/Profile/Chat'
import NotFound from './pages/NotFound'

import { AuthRoute } from '@/components/AuthRoute'
import { KeepAlive } from '@/components/KeepAlive'

import './App.css'

function App() {
  return (
    <Router history={history}>
      {/* 注意：与 Switch 不兼容 */}
      <KeepAlive alivePath="/home" path="/home" exact component={Layout} />

      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home/index" />} />
        <Route
          exact
          path="/home"
          render={() => <Redirect to="/home/index" />}
        />

        <Route path="/login" component={Login} />
        <Route path="/search" component={Search} />
        <Route path="/article/:id" component={Article} />
        <Route path="/search/result" component={SearchResult} />
        <AuthRoute path="/profile/edit" component={ProfileEdit} />
        <AuthRoute path="/profile/feedback" component={ProfileFeedback} />
        <AuthRoute path="/profile/chat" component={Chat} />
        {/* <Route path="*" component={NotFound} /> */}
        {/* 注意：因为 /home 不在 Switch 内部，所以，需要手动处理 /home 开头的路由，否则，会被当做 404 处理 */}
        <Route
          path="*"
          render={props => {
            if (props.location.pathname.startsWith('/home')) {
              return null
            }
            return <NotFound {...props} />
          }}
        />
      </Switch>
    </Router>
  )
}

export default App
