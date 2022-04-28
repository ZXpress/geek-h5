import request from '@/utils/request'
import { removeTokenInfo, setTokenInfo } from '@/utils/storage'
import { LOGOUT } from '../action_types/profile'

/**
 * 发送短信验证码
 * @param {string} mobile 手机号码
 * @returns thunk
 */
export const sendCode = (mobile) => {
  return async () => {
    await request.get(`/sms/codes/${mobile}`)
  }
}

export const saveToken = (payload) => {
  return {
    type: 'login/token',
    payload,
  }
}

/**
 * 登录
 * @param {*} data
 * @returns
 */
export const login = (data) => {
  return async (dispatch) => {
    const res = await request({
      url: '/authorizations',
      method: 'post',
      data,
    })
    // 保存token
    dispatch(saveToken(res.data))
    // 同时保存到本地
    setTokenInfo(res.data)
  }
}

// logout
export const logout = () => {
  return (dispatch) => {
    // 移除本地的token
    removeTokenInfo()
    // 移除redux中的token
    dispatch({
      type: LOGOUT,
    })
  }
}
