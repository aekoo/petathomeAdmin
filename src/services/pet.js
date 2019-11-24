import request from '@/utils/request';
import { jsonToFormData } from '@/utils/utils';
// 宠物列表
export async function queryPetList(params) {
  return request('/admin/customer/queryCustomerPetList', {
    params,
  });
}

// 品种列表
export async function queryPetKind(params) {
  return request('/admin/pet/queryPetKindByType', {
    params,
  });
}
// 添加/修改
export async function editPetKind(params) {
  return request('/admin/pet/addOrUpdatePetKind', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deletePetKind(params) {
  return request('/admin/pet/deletePetKind', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 上下架
export async function displayPetKind(params) {
  return request('/admin/pet/shelfOrObtainedPetKind', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}

// 高级服务列表
export async function queryAdvanced(params) {
  return request('/admin/pet/advancedService/queryAllAdvancedService', {
    params,
  });
}
// 添加/修改
export async function editAdvanced(params) {
  return request('/admin/pet/advancedService/addOrUpdateAdvancedService', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 删除
export async function deleteAdvanced(params) {
  return request('/admin/pet/advancedService/deleteAdvancedService', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
// 上下架
export async function displayAdvanced(params) {
  return request('/admin/pet/advancedService/shelfOrObtainedAdvancedService', {
    method: 'POST',
    data: jsonToFormData(params),
  });
}
