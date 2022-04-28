import { Toast } from 'antd-mobile'
import axios from 'axios'
import { getTokenInfo, setTokenInfo } from './storage'
import history from './history'
import store from '@/store'
import { logout, saveToken } from '@/store/actions/login'

const baseURL = 'http://geek.itheima.net/v1_0/'
const instance = axios.create({
  timeout: 5000,
  baseURL,
})

// 配置拦截器
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = getTokenInfo().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data
  },
  async function (error) {
    // 对响应错误做点什么
    if (!error.response) {
      Toast.info('网络繁忙,请稍后重试')
      return Promise.reject(error)
    }
    const { response, config } = error
    // 网络没问题，返回的有数据
    if (response.status !== 401) {
      // 不是token失效问题
      Toast.info(response.data.message)
      return Promise.reject(error)
    }
    // 是401token失效问题
    // 1.判断有无refresh_token(过不来，在AutoRouter被拦截，除非只有token，没有refresh_token且token过期)
    const { token, refresh_token } = getTokenInfo()
    // if (!token || !refresh_token) {
    //   // 跳转到登录页
    //   console.log(history)
    //   history.push({
    //     pathname: '/login',
    //     state: {
    //       from: history.location.pathname,
    //     },
    //   })
    //   return Promise.reject(error)
    // }

    // 401有刷新token刷新token
    // 发请求获取新的token，注意：刷新token发送请求，不能使用封装的instance
    try {
      const res = await axios({
        method: 'put',
        url: baseURL + 'authorizations',
        headers: {
          Authorization: 'Bearer ' + refresh_token,
        },
      })
      // 成功保存新的token并加上refresh_token
      const tokenInfo = {
        token: res.data.data.token,
        refresh_token: refresh_token,
      }
      store.dispatch(saveToken(tokenInfo))
      setTokenInfo(tokenInfo)

      // token刷新成功后，重新把最开始失败的请求重新发一次(无感刷新)
      // config请求信息包含baseUrl和url
      return instance(config)
    } catch (error) {
      // 刷新token失败，refrsh_token过期
      store.dispatch(logout())
      // 跳转到登录页
      history.push({
        pathname: '/login',
        state: {
          from: history.location.pathname,
        },
      })
      // return Promise.reject(error)
    }
    Toast.info('登录信息失效，请重新登录')
    return Promise.reject(error)
  }
)

export default instance
