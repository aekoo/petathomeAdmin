import { message } from 'antd';
import {
  queryScrollingText,
  editScrollingText,
  deleteScrollingText,
  displayScrollingText,
  queryBannerList,
  editBanner,
  deleteBanner,
  displayBanner,
  getDict,
  editDict,
  deleteDict,
} from '@/services/deploy';

const DeployModel = {
  namespace: 'deploy',
  state: {
    position: 'top',
    listData: {},
    dictData: {},
  },
  effects: {
    // 通知
    *fetchNotice({ payload }, { call, put }) {
      const response = yield call(queryScrollingText, payload);
      yield put({
        type: 'saveListData',
        payload: response,
      });
    },
    *editNotice({ payload }, { call, put }) {
      const response = yield call(editScrollingText, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
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

    // banner
    *fetchBanner({ payload }, { call, put, select }) {
      const { position } = yield select(_ => _.deploy);
      const response = yield call(queryBannerList, { position });
      yield put({
        type: 'saveListData',
        payload: response,
      });
    },
    *editBanner({ payload }, { call, put }) {
      const response = yield call(editBanner, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchBanner',
      });
    },
    *deleteBanner({ payload }, { call, put }) {
      const response = yield call(deleteBanner, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchBanner',
      });
    },
    *displayBanner({ payload }, { call, put }) {
      const response = yield call(displayBanner, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchBanner',
      });
    },

    // dict 字典
    *fetchDict({ payload }, { call, put }) {
      const response = yield call(getDict, { dictType: 1 });
      yield put({
        type: 'saveDictData',
        payload: response,
      });
    },
    *editDict({ payload }, { call, put }) {
      const response = yield call(editDict, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchDict',
      });
    },
    *deleteDict({ payload }, { call, put }) {
      const response = yield call(deleteDict, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchDict',
      });
    },
  },
  reducers: {
    saveListData(state, { payload }) {
      return { ...state, listData: payload };
    },
    saveDictData(state, { payload }) {
      return { ...state, dictData: payload };
    },
    positionChange(state, { payload }) {
      return { ...state, position: payload };
    },
  },
};
export default DeployModel;
