import { SAVE_PROFILE, SAVE_USER } from '../action_types/profile'

const initValue = {
  user: {},
  profile: {},
}

export default function (state = initValue, action) {
  const { type, payload } = action
  if (type === SAVE_USER) {
    return {
      ...state,
      user: payload,
    }
  }
  if (type === SAVE_PROFILE) {
    return {
      ...state,
      profile: payload,
    }
  }
  return state
}
