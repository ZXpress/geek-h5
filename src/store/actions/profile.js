import request from '@/utils/request'
import { removeTokenInfo } from '@/utils/storage'
import { SAVE_USER, SAVE_PROFILE, LOGOUT } from '../action_types/profile'

export const saveUser = (payload) => {
  return {
    type: SAVE_USER,
    payload,
  }
}

export const getUser = () => {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/user',
    })
    dispatch(saveUser(res.data))
  }
}

export const saveProfile = (payload) => {
  return {
    type: SAVE_PROFILE,
    payload,
  }
}

export const getProfile = () => {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/user/profile',
    })
    dispatch(saveProfile(res.data))
  }
}

// 修改用户信息
export const updateProfile = (data) => {
  return async (dispatch) => {
    await request({
      method: 'patch',
      url: '/user/profile',
      data,
    })
    dispatch(getProfile())
  }
}

// 修改头像
export const updatePhoto = (data) => {
  return async (dispatch) => {
    await request({
      method: 'patch',
      url: '/user/photo',
      data,
    })
    dispatch(getProfile())
  }
}
