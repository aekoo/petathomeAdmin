import { message } from 'antd';
import {
  queryEmployee,
  updateRemark,
  updateReview,
  queryEmployeeDetail,
} from '@/services/employee';

const EmployeeModel = {
  namespace: 'employee',
  state: {
    listData: {},
    detail: {},
  },
  effects: {
    *fetchEmployee({ payload }, { call, put }) {
      const response = yield call(queryEmployee, payload);
      yield put({
        type: 'saveEmployee',
        payload: response,
      });
    },
    *updateRemark({ payload, callback }, { call, put }) {
      const response = yield call(updateRemark, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      // yield put({
      //   type: 'fetchEmployee',
      // });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    *updateReview({ payload, callback }, { call, put }) {
      const response = yield call(updateReview, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      // yield put({
      //   type: 'fetchEmployee',
      // });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
    *fetchEmployeeDetail({ payload }, { call, put }) {
      const response = yield call(queryEmployeeDetail, payload);
      yield put({
        type: 'saveEmployeeDetail',
        payload: response,
      });
    },
  },
  reducers: {
    saveEmployee(state, { payload }) {
      return { ...state, listData: payload };
    },
    saveEmployeeDetail(state, { payload }) {
      return { ...state, detail: payload };
    },
  },
};
export default EmployeeModel;
