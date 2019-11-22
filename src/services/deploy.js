import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

// 通知列表
export async function queryScrollingText(params) {
  return request('/admin/scrollingText/queryAll', { params });
}
// 添加/修改消息
export async function editScrollingText(params) {
  return request('/admin/scrollingText/addOrUpdateScrollingText', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除消息
export async function deleteScrollingText(params) {
  return request('/admin/scrollingText/deleteScrollingText', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 显示/隐藏消息
export async function displayScrollingText(params) {
  return request('/admin/scrollingText/showOrHideScrollingText', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}


// banner列表
export async function queryBannerList(params) {
  return request('/admin/banner/queryPageList', { params });
}
// 添加/修改
export async function editBanner(params) {
  return request('/admin/banner/addOrUpdateBanner', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deleteBanner(params) {
  return request('/admin/banner/deleteBanner', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 显示/隐藏
export async function displayBanner(params) {
  return request('/admin/banner/showOrHideBanner', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}