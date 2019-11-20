import request from '@/utils/request';

export async function queryEmployee(params) {
  return request('/admin/shit/queryShovelShitOfficerList', {
    params,
  });
}
