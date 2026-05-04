import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// 登录方法
export function login(username, password, code, uuid) {
  return request({
    url: '/zebra-passport/user_auth.UserAuthService/Login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: { user_name: username, password: password, code: code, uuid: uuid }
  })
}

// 注册方法（暂未实现）
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 解锁屏幕（暂未实现）
export function unlockScreen(password) {
  return request({
    url: '/auth/unlockscreen',
    method: 'post',
    data: { password }
  })
}

// 刷新方法（暂未实现）
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo(userId) {
  let finalUserId = userId
  if (!finalUserId || finalUserId === 0) {
    const token = getToken()
    if (token) {
      const parsed = parseJwt(token)
      if (parsed && parsed.user_id) {
        finalUserId = parsed.user_id
      }
    }
  }
  return request({
    url: '/zebra-passport/user_auth.UserAuthService/GetInfo',
    method: 'post',
    data: { user_id: finalUserId || 0 }
  })
}

// 退出方法
export function logout(userId) {
  let finalUserId = userId
  if (!finalUserId || finalUserId === 0) {
    const token = getToken()
    if (token) {
      const parsed = parseJwt(token)
      if (parsed && parsed.user_id) {
        finalUserId = parsed.user_id
      }
    }
  }
  return request({
    url: '/zebra-passport/user_auth.UserAuthService/Logout',
    method: 'post',
    data: { user_id: finalUserId }
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/zebra-passport/captcha.CaptchaService/GetCaptcha',
    headers: {
      isToken: false
    },
    method: 'post',
    data: {},
    timeout: 20000
  })
}
