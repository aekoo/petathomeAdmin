import { message } from 'antd';
import {
  queryScrollingText,
  editScrollingText,
  deleteScrollingText,
  displayScrollingText,
} from '@/services/deploy';

const DeployModel = {
  namespace: 'deploy',
  state: {
    noticeData: {},
  },
  effects: {
    *fetchNotice({ payload }, { call, put }) {
      const response = yield call(queryScrollingText, payload);
      yield put({
        type: 'saveNotice',
        payload: response,
      });
    },
    *editNotice({ payload }, { call, put }) {
      const response = yield call(editScrollingText, payload);
      yield put({
        type: 'fetchNotice',
      });
    },
    *deleteNotice({ payload }, { call, put }) {
      const response = yield call(deleteScrollingText, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchNotice',
      });
    },
    *displayNotice({ payload }, { call, put }) {
      const response = yield call(displayScrollingText, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchNotice',
      });
    },
  },
  reducers: {
    saveNotice(state, { payload }) {
      return { ...state, noticeData: payload };
    },
  },
};
export default DeployModel;
