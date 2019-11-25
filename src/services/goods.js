import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

// 商品列表
export async function queryGoodsList(params) {
  return request('/admin/goods/queryGoodsList', {
    params,
  });
}
// 添加/修改
export async function editGoods(params) {
  return request('/admin/goods/addOrUpdateGoods', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deleteGoods(params) {
  return request('/admin/goods/deleteGoods', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 上下架
export async function displayGoods(params) {
  return request('/admin/goods/shelfOrObtainedGoods', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
