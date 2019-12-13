import { queryCustomer } from '@/services/customer';

const CustomerModel = {
  namespace: 'customer',
  state: {
    listData: {},
  },
  effects: {
    *fetchCustomer({ payload }, { call, put }) {
      const response = yield call(queryCustomer, payload);
      yield put({
        type: 'saveCustomer',
        payload: response,
      });
    },
  },
  reducers: {
    saveCustomer(state, { payload }) {
      return { ...state, listData: payload, };
    },
  },
};
export default CustomerModel;
