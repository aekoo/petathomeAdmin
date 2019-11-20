import request from '@/utils/request';

export async function queryCustomer(params) {
  return request('/admin/customer/queryPageList', {
    params,
  });
}
