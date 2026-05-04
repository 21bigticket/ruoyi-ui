import request from '@/utils/request'
import { getToken } from '@/utils/auth'

function parseJwt(token) {
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

// 获取路由
export const getRouters = () => {
  let userId = 0
  const token = getToken()
  if (token) {
    const parsed = parseJwt(token)
    if (parsed && parsed.user_id) {
      userId = parsed.user_id
    }
  }
  return request({
    url: '/zebra-passport/menu.MenuService/GetRouters',
    method: 'post',
    data: { user_id: userId }
  })
}
