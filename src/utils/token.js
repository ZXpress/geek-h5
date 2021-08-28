const KEY = 'geek-itcast'

const getTokens = () => JSON.parse(window.localStorage.getItem(KEY)) || {}

const setTokens = tokens =>
  window.localStorage.setItem(KEY, JSON.stringify(tokens))

const removeTokens = () => window.localStorage.removeItem(KEY)

const isAuth = () => !!getTokens().token

export { getTokens, setTokens, removeTokens, isAuth }
