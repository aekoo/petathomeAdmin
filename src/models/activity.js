import { message } from 'antd';
import {
  queryActivity,
  editActivity,
  deleteActivity,
  queryActivityOrders,
  editActivityOrdersRemark,
  activityOrdersRefund
} from '@/services/activity';

const ActivityModel = {
  namespace: 'activity',
  state: {
    listData: {},
    orderData: {},
  },
  effects: {
    *fetchActivity({ payload }, { call, put }) {
      const response = yield call(queryActivity, payload);
      yield put({
        type: 'saveActivity',
        payload: response,
      });
    },
    *editActivity({ payload }, { call, put }) {
      const response = yield call(editActivity, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchActivity',
      });
    },
    *deleteActivity({ payload }, { call, put }) {
      const response = yield call(deleteActivity, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'fetchActivity',
      });
    },


    *fetchActivityOrders({ payload }, { call, put }) {
      const response = yield call(queryActivityOrders, payload);
      yield put({
        type: 'saveActivityOrders',
        payload: response,
      });
    },
    *editActivityOrdersRemark({ payload, callback }, { call, put }) {
      const response = yield call(editActivityOrdersRemark, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      // yield put({ type: 'fetchActivityOrders', });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },

    *activityOrdersRefund({ payload, callback }, { call, put }) {
      const response = yield call(activityOrdersRefund, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      // yield put({ type: 'fetchActivityOrders', });
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },
  },
  reducers: {
    saveActivity(state, { payload }) {
      return { ...state, listData: payload };
    },
    saveActivityOrders(state, { payload }) {
      return { ...state, orderData: payload };
    },
  },
};
export default ActivityModel;
