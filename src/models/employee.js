import { queryEmployee } from '@/services/employee';

const EmployeeModel = {
  namespace: 'employee',
  state: {
    listData: {},
  },
  effects: {
    *fetchEmployee({ payload }, { call, put }) {
      const response = yield call(queryEmployee, payload);
      yield put({
        type: 'saveEmployee',
        payload: response,
      });
    },
  },
  reducers: {
    saveEmployee(state, { payload }) {
      return { ...state, listData: payload, };
    },
  },
};
export default EmployeeModel;
