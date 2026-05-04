import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/zebra-passport/menu.MenuService/List',
    method: 'post',
    data: {
      menu_name: query ? query.menuName : undefined,
      status: query ? query.status : undefined
    }
  }).then(res => ({ data: res.menus || [] }))
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/zebra-passport/menu.MenuService/Get',
    method: 'post',
    data: { menu_id: menuId }
  }).then(res => ({ data: res.menu }))
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/zebra-passport/menu.MenuService/TreeSelect',
    method: 'post',
    data: {}
  }).then(res => ({ data: res.menus || [] }))
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/zebra-passport/menu.MenuService/RoleMenuTreeSelect',
    method: 'post',
    data: { role_id: roleId }
  }).then(res => ({ data: res.menus || [], checkedKeys: res.checkedKeys || [] }))
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/zebra-passport/menu.MenuService/Create',
    method: 'post',
    data: {
      menu_name: data.menuName,
      parent_id: data.parentId,
      order_num: data.orderNum,
      path: data.path,
      component: data.component,
      query: data.query,
      route_name: data.routeName,
      is_frame: data.isFrame,
      is_cache: data.isCache,
      menu_type: data.menuType,
      visible: data.visible,
      status: data.status,
      perms: data.perms,
      icon: data.icon,
      remark: data.remark
    }
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/zebra-passport/menu.MenuService/Update',
    method: 'post',
    data: {
      menu_id: data.menuId,
      menu_name: data.menuName,
      parent_id: data.parentId,
      order_num: data.orderNum,
      path: data.path,
      component: data.component,
      query: data.query,
      route_name: data.routeName,
      is_frame: data.isFrame,
      is_cache: data.isCache,
      menu_type: data.menuType,
      visible: data.visible,
      status: data.status,
      perms: data.perms,
      icon: data.icon,
      remark: data.remark
    }
  })
}

// 保存菜单排序
export function updateMenuSort(data) {
  return request({
    url: '/zebra-passport/menu.MenuService/UpdateSort',
    method: 'post',
    data: { items: data }
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/zebra-passport/menu.MenuService/Delete',
    method: 'post',
    data: { menu_id: menuId }
  })
}
