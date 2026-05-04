import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/zebra-passport/post.PostService/List',
    method: 'post',
    data: {
      page: query.pageNum || 1,
      page_size: query.pageSize || 10,
      post_code: query.postCode,
      post_name: query.postName,
      status: query.status
    }
  }).then(res => ({ rows: res.posts || [], total: res.total || 0 }))
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/zebra-passport/post.PostService/Get',
    method: 'post',
    data: { post_id: postId }
  }).then(res => ({ data: res.post }))
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/zebra-passport/post.PostService/Create',
    method: 'post',
    data: {
      post_code: data.postCode,
      post_name: data.postName,
      post_sort: data.postSort,
      status: data.status,
      remark: data.remark
    }
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/zebra-passport/post.PostService/Update',
    method: 'post',
    data: {
      post_id: data.postId,
      post_code: data.postCode,
      post_name: data.postName,
      post_sort: data.postSort,
      status: data.status,
      remark: data.remark
    }
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/zebra-passport/post.PostService/Delete',
    method: 'post',
    data: { post_ids: Array.isArray(postId) ? postId : [postId] }
  })
}
