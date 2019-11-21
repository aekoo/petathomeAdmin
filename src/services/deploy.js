import request from '@/utils/request';

// 通知消息
export async function queryScrollingText(params) {
  return request('/admin/scrollingText/queryAll', {
    params,
  });
}
