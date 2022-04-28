import { LOGOUT } from '../action_types/profile'

const initValue = {
  token: '',
  refresh_token: '',
}
export default function reducer(state = initValue, action) {
  const { type, payload } = action
  if (type === 'login/token') {
    return payload
  }
  if (type === LOGOUT) {
    return {}
  }
  return state
}
