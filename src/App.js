import React, { Suspense } from 'react'
import AuthRoute from './components/AuthRoute'
import {
  // BrowserRouter as Router,
  Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import history from './utils/history'

// 按需导入
const Login = React.lazy(() => import('@/pages/Login'))
const Home = React.lazy(() => import('@/pages/Layout'))
const ProfileEdit = React.lazy(() => import('@/pages/Profile/Edit'))
const ProfileChat = React.lazy(() => import('@/pages/Profile/Chat'))
const NotFound = React.lazy(() => import('@/pages/NotFound'))
const FeedBack = React.lazy(() => import('@/pages/Profile/Feedback'))

export default function App() {
  return (
    <div>
      {/* BrowserRouter等价于Router + history={history} */}
      <Router history={history}>
        <div className="app">
          <Suspense fallback={<div>loading...</div>}>
            <Switch>
              <Redirect exact from="/" to="/home"></Redirect>
              <Route path="/login" component={Login}></Route>
              <Route path="/home" component={Home}></Route>

              {/* 需要登录才能访问 */}
              <AuthRoute
                path="/profile/edit"
                component={ProfileEdit}
              ></AuthRoute>
              <AuthRoute
                path="/profile/chat"
                component={ProfileChat}
              ></AuthRoute>
              <AuthRoute
                path="/profile/feedback"
                component={FeedBack}
              ></AuthRoute>

              {/* 404 */}
              <Route component={NotFound}></Route>
            </Switch>
          </Suspense>
        </div>
      </Router>
    </div>
  )
}
