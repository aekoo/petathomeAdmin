import { queryScrollingText } from '@/services/deploy';

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
  },
  reducers: {
    saveNotice(state, { payload }) {
      return { ...state, noticeData: payload, };
    },
  },
};
export default DeployModel;
