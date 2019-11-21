import request from '@/utils/request';

// 通知消息
export async function queryScrollingText(params) {
  return request('/admin/scrollingText/queryAll', {
    params,
  });
}
// 添加/修改消息
export async function editScrollingText(params) {
  return request('/admin/scrollingText/addOrUpdateScrollingText', {
    method: 'POST',
    data: params,
  });
}
// 删除消息
export async function deleteScrollingText(params) {
  return request('/admin/scrollingText/deleteScrollingText', {
    method: 'POST',
    data: params,
  });
}
// 显示/隐藏消息
export async function displayScrollingText(params) {
  return request('/admin/scrollingText/showOrHideScrollingText', {
    method: 'POST',
    data: params,
  });
}
