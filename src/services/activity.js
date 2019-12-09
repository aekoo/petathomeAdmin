import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

// 查询活动
export async function queryActivity(params) {
  return request('/admin/activity/queryActivityList', {
    params,
  });
}

// 添加/修改
export async function editActivity(params) {
  return request('/admin/activity/addOrUpdateActivity', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deleteActivity(params) {
  return request('/admin/activity/deleteActivity', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}


// 查询订单
export async function queryActivityOrders(params) {
  return request('/admin/activity/queryActivityOrders', {
    params,
  });
}

// 修改订单备注
export async function editActivityOrdersRemark(params) {
  return request('/admin/activity/updateActivityOrder', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 退款
export async function activityOrdersRefund(params) {
  return request('/admin/activity/refund', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}