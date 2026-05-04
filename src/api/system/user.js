import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/zebra-passport/user.UserService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      user_name: query.userName,
      phonenumber: query.phonenumber,
      status: query.status,
      dept_id: query.deptId,
      begin_time: query.params?.beginTime,
      end_time: query.params?.endTime
    }
  }).then(res => ({ rows: res.users || [], total: res.total || 0 }))
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/zebra-passport/user.UserService/Get',
    method: 'post',
    data: { user_id: userId }
  }).then(res => ({ data: res.user, roles: res.roles, posts: res.posts, roleIds: res.roleIds, postIds: res.postIds }))
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/zebra-passport/user.UserService/Create',
    method: 'post',
    data: {
      dept_id: data.deptId,
      user_name: data.userName,
      nick_name: data.nickName,
      password: data.password,
      email: data.email,
      phonenumber: data.phonenumber,
      sex: data.sex,
      status: data.status,
      remark: data.remark,
      role_ids: data.roleIds,
      post_ids: data.postIds
    }
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/zebra-passport/user.UserService/Update',
    method: 'post',
    data: {
      user_id: data.userId,
      dept_id: data.deptId,
      nick_name: data.nickName,
      email: data.email,
      phonenumber: data.phonenumber,
      sex: data.sex,
      status: data.status,
      remark: data.remark,
      role_ids: data.roleIds,
      post_ids: data.postIds
    }
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/zebra-passport/user.UserService/Delete',
    method: 'post',
    data: { user_ids: Array.isArray(userId) ? userId : [userId] }
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  return request({
    url: '/zebra-passport/user.UserService/ResetPwd',
    method: 'post',
    data: { user_id: userId, password: password }
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  return request({
    url: '/zebra-passport/user.UserService/ChangeStatus',
    method: 'post',
    data: { user_id: userId, status: status }
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/zebra-passport/user_profile.UserProfileService/GetProfile',
    method: 'post',
    data: {}
  }).then(res => ({ data: res.user, roles: res.roles, posts: res.posts, roleGroup: res.roleGroup, postGroup: res.postGroup }))
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/zebra-passport/user_profile.UserProfileService/UpdateProfile',
    method: 'post',
    data: {
      nick_name: data.nickName,
      email: data.email,
      phonenumber: data.phonenumber,
      sex: data.sex
    }
  })
}

// 用户密码修改
export function updateUserPwd(oldPassword, newPassword) {
  return request({
    url: '/zebra-passport/user_profile.UserProfileService/UpdatePwd',
    method: 'post',
    data: { old_password: oldPassword, new_password: newPassword }
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/zebra-passport/user_profile.UserProfileService/UploadAvatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/zebra-passport/user_profile.UserProfileService/GetAuthRole',
    method: 'post',
    data: { user_id: userId }
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/zebra-passport/user_profile.UserProfileService/UpdateAuthRole',
    method: 'post',
    data: { user_id: data.userId, role_ids: data.roleIds }
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/zebra-passport/user_profile.UserProfileService/DeptTreeSelect',
    method: 'post',
    data: {}
  }).then(res => {
    const transformDept = (dept) => ({
      id: dept.deptId,
      label: dept.deptName,
      children: dept.children ? dept.children.map(transformDept) : [],
      disabled: dept.status === '1'
    })
    const depts = res.depts || []
    return { data: depts.map(transformDept) }
  })
}
