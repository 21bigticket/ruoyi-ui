import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/zebra-passport/dept.DeptService/List',
    method: 'post',
    data: {
      dept_name: query.deptName,
      status: query.status
    }
  }).then(res => ({ data: res.depts || [] }))
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/zebra-passport/dept.DeptService/ListExcludeChild',
    method: 'post',
    data: { dept_id: deptId }
  }).then(res => ({ data: res.depts || [] }))
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/zebra-passport/dept.DeptService/Get',
    method: 'post',
    data: { dept_id: deptId }
  }).then(res => ({ data: res.dept }))
}

// 新增部门
export function addDept(data) {
  return request({
    url: '/zebra-passport/dept.DeptService/Create',
    method: 'post',
    data: {
      parent_id: data.parentId,
      dept_name: data.deptName,
      order_num: data.orderNum,
      leader: data.leader,
      phone: data.phone,
      email: data.email,
      status: data.status
    }
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/zebra-passport/dept.DeptService/Update',
    method: 'post',
    data: {
      dept_id: data.deptId,
      parent_id: data.parentId,
      dept_name: data.deptName,
      order_num: data.orderNum,
      leader: data.leader,
      phone: data.phone,
      email: data.email,
      status: data.status
    }
  })
}

// 保存部门排序
export function updateDeptSort(data) {
  return request({
    url: '/zebra-passport/dept.DeptService/UpdateSort',
    method: 'post',
    data: { items: data }
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/zebra-passport/dept.DeptService/Delete',
    method: 'post',
    data: { dept_id: deptId }
  })
}
