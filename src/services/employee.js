import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

export async function queryEmployee(params) {
  return request('/admin/shit/queryShovelShitOfficerList', {
    params,
  });
}
export async function queryEmployeeDetail(params) {
  return request('/admin/shit/queryShovelShitOfficerDetail', {
    params,
  });
}
export async function updateRemark(params) {
  return request('/admin/shit/updateRemark', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
export async function updateReview(params) {
  return request('/admin/shit/updateReview', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
