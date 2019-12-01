import { message } from 'antd';
import { queryOrder, distribution, confirmRefund, editRemark } from '@/services/order';

const OrderModel = {
  namespace: 'orders',
  state: {
    listData: {},
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *editRemark({ payload, callback }, { call, put }) {
      const response = yield call(editRemark, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetch',
      });
    },
    *distribution({ payload, callback }, { call, put }) {
      const response = yield call(distribution, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetch',
      });
    },
    *confirmRefund({ payload, callback }, { call, put }) {
      const response = yield call(confirmRefund, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      // yield put({
      //   type: 'fetch',
      // });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, listData: action.payload };
    },
  },
};
export default OrderModel;
