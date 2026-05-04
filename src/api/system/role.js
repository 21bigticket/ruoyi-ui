import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/zebra-passport/role.RoleService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      role_name: query.roleName,
      role_key: query.roleKey,
      status: query.status,
      begin_time: query.params?.beginTime,
      end_time: query.params?.endTime
    }
  }).then(res => ({ rows: res.roles || [], total: res.total || 0 }))
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/zebra-passport/role.RoleService/Get',
    method: 'post',
    data: { role_id: roleId }
  }).then(res => ({ data: res.role, menuIds: res.menuIds, deptIds: res.deptIds }))
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/zebra-passport/role.RoleService/Create',
    method: 'post',
    data: {
      role_name: data.roleName,
      role_key: data.roleKey,
      role_sort: data.roleSort,
      data_scope: data.dataScope,
      menu_check_strictly: data.menuCheckStrictly,
      dept_check_strictly: data.deptCheckStrictly,
      status: data.status,
      remark: data.remark,
      menu_ids: data.menuIds
    }
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/zebra-passport/role.RoleService/Update',
    method: 'post',
    data: {
      role_id: data.roleId,
      role_name: data.roleName,
      role_key: data.roleKey,
      role_sort: data.roleSort,
      data_scope: data.dataScope,
      menu_check_strictly: data.menuCheckStrictly,
      dept_check_strictly: data.deptCheckStrictly,
      status: data.status,
      remark: data.remark,
      menu_ids: data.menuIds
    }
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/zebra-passport/role.RoleService/DataScope',
    method: 'post',
    data: {
      role_id: data.roleId,
      data_scope: data.dataScope,
      dept_ids: data.deptIds
    }
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  return request({
    url: '/zebra-passport/role.RoleService/ChangeStatus',
    method: 'post',
    data: { role_id: roleId, status: status }
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/zebra-passport/role.RoleService/Delete',
    method: 'post',
    data: { role_ids: Array.isArray(roleId) ? roleId : [roleId] }
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
  return request({
    url: '/zebra-passport/role_user.RoleUserService/AllocatedUserList',
    method: 'post',
    data: {
      role_id: query.roleId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_name: query.userName,
      phonenumber: query.phonenumber
    }
  }).then(res => ({ rows: res.users || [], total: res.total || 0 }))
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
  return request({
    url: '/zebra-passport/role_user.RoleUserService/UnallocatedUserList',
    method: 'post',
    data: {
      role_id: query.roleId,
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_name: query.userName,
      phonenumber: query.phonenumber
    }
  }).then(res => ({ rows: res.users || [], total: res.total || 0 }))
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/zebra-passport/role_user.RoleUserService/AuthUserCancel',
    method: 'post',
    data: { user_id: data.userId, role_id: data.roleId }
  })
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
  return request({
    url: '/zebra-passport/role_user.RoleUserService/AuthUserCancelAll',
    method: 'post',
    data: { role_id: data.roleId, user_ids: data.userIds }
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/zebra-passport/role_user.RoleUserService/AuthUserSelectAll',
    method: 'post',
    data: { role_id: data.roleId, user_ids: data.userIds }
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
  return request({
    url: '/zebra-passport/role.RoleService/DeptTreeSelect',
    method: 'post',
    data: { role_id: roleId }
  }).then(res => {
    const transformDept = (dept) => ({
      id: dept.deptId,
      label: dept.deptName,
      children: dept.children ? dept.children.map(transformDept) : []
    })
    const depts = res.depts || []
    return { depts: depts.map(transformDept) }
  })
}
