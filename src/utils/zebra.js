/**
 * Zebra API 响应适配器
 * 将 zebra-passport 的 Dubbo Triple 响应格式转换为 RuoYi 前端期望的格式
 *
 * zebra 列表响应格式: {code: 0, msg: "success", users: [...], total: 100}
 * RuoYi 前端期望格式: {rows: [...], total: 100}
 *
 * zebra 详情响应格式: {code: 0, msg: "success", user: {...}, roles: [...], ...}
 * RuoYi 前端期望格式: {data: {...}, roles: [...], ...} 或直接使用顶层字段
 */

/**
 * 将 zebra 列表响应转换为 RuoYi 格式
 * 自动检测数组字段并将其映射到 `rows`
 * @param {Object} res - zebra 响应对象
 * @returns {Object} - {rows: [...], total: N}
 */
export function adaptListResponse(res) {
  // 如果已经有 rows 字段，直接返回
  if (res.rows) {
    return res
  }
  // 查找第一个数组类型的字段作为 rows
  const total = res.total || 0
  for (const key of Object.keys(res)) {
    if (Array.isArray(res[key])) {
      return { rows: res[key], total }
    }
  }
  return { rows: [], total }
}

/**
 * 将 zebra 详情响应转换为 RuoYi 格式
 * 有些 RuoYi 页面期望 {data: {...}} 格式
 * @param {Object} res - zebra 响应对象
 * @param {string} entityKey - 实体字段名（如 'user', 'role', 'menu' 等）
 * @returns {Object} - 包含 data 字段的响应
 */
export function adaptDetailResponse(res, entityKey) {
  if (res.data) {
    return res
  }
  // 将实体字段移到 data 中，其他字段保持不变
  const result = { ...res }
  if (result[entityKey]) {
    result.data = result[entityKey]
  }
  return result
}

/**
 * 将 zebra 树形响应转换为 RuoYi 格式
 * @param {Object} res - zebra 响应对象
 * @param {string} treeKey - 树形数据字段名（如 'menus', 'depts' 等）
 * @returns {Object} - {data: [...]}
 */
export function adaptTreeResponse(res, treeKey) {
  if (res.data) {
    return res
  }
  const result = { ...res }
  if (result[treeKey]) {
    result.data = result[treeKey]
  }
  return result
}

/**
 * camelCase 转 snake_case
 */
export function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 将对象的 key 从 camelCase 转换为 snake_case
 */
export function toSnakeCaseKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    result[toSnakeCase(key)] = value
  }
  return result
}
