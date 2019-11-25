import { message } from 'antd';
import { queryGoodsList, editGoods, deleteGoods, displayGoods } from '@/services/goods';

const PetModel = {
  namespace: 'goods',
  state: {
    listData: [],
    classification: 0,
    goodsType: 0
  },
  effects: {

    // 商品列表
    *gainGoods({ payload }, { call, put, select }) {
      const { classification, goodsType } = yield select(_ => _.goods);
      const response = yield call(queryGoodsList, payload || { classification, goodsType });
      yield put({
        type: 'saveGoods',
        payload: response,
      });
    },
    // 添加/修改
    *editGoods({ payload }, { call, put }) {
      const response = yield call(editGoods, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainGoods',
      });
    },
    // 删除
    *deleteGoods({ payload }, { call, put }) {
      const response = yield call(deleteGoods, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainGoods',
      });
    },
    // 上下架
    *displayGoods({ payload }, { call, put }) {
      const response = yield call(displayGoods, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainGoods',
      });
    },
  },
  reducers: {
    saveGoods(state, { payload }) {
      return { ...state, listData: payload.results || [] };
    },
    searchChange(state, { payload }) {
      return { ...state, classification: payload.classification, goodsType: payload.goodsType };
    },
  },
};
export default PetModel;
