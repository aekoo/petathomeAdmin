import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';

// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function fakeAccountLogin(params) {
  return request('/admin/operator/login', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
