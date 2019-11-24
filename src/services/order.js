import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

export async function queryOrder(params) {
  return request('/admin/order/queryOrderPageList', {
    params,
  });
}
export async function editRemark(params) {
  return request('/admin/order/editRemark', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
export async function distribution(params) {
  return request('/admin/order/distribution', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
export async function confirmRefund(params) {
  return request('/admin/order/confirmRefund', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
