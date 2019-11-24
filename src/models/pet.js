import { message } from 'antd';
import {
  queryPetList,
  queryPetKind,
  editPetKind,
  deletePetKind,
  displayPetKind,
  queryAdvanced,
  editAdvanced,
  deleteAdvanced,
  displayAdvanced,
} from '@/services/pet';

const PetModel = {
  namespace: 'pet',
  state: {
    listData: [],
    petType: 0,
    petKindList: [],
    serverType: 0,
    advancedList: [],
  },
  effects: {
    // 查询用户宠物列表
    *fetchPet({ payload }, { call, put }) {
      const response = yield call(queryPetList, payload);
      yield put({
        type: 'savePet',
        payload: response,
      });
    },

    // 品种列表
    *gainPetKind({ payload }, { call, put, select }) {
      const { petType } = yield select(_ => _.pet);
      const response = yield call(queryPetKind, payload || { petType });
      yield put({
        type: 'savePetKind',
        payload: response,
      });
    },
    // 添加/修改
    *editPetKind({ payload }, { call, put }) {
      const response = yield call(editPetKind, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainPetKind',
      });
    },
    // 删除
    *deletePetKind({ payload }, { call, put }) {
      const response = yield call(deletePetKind, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainPetKind',
      });
    },
    // 上下架
    *displayPetKind({ payload }, { call, put }) {
      const response = yield call(displayPetKind, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainPetKind',
      });
    },

    // 高级服务列表
    *gainAdvanced({ payload }, { call, put, select }) {
      const { serverType } = yield select(_ => _.pet);
      const response = yield call(queryAdvanced, payload || { serverType });
      yield put({
        type: 'saveAdvanced',
        payload: response,
      });
    },
    // 添加/修改
    *editAdvanced({ payload }, { call, put }) {
      const response = yield call(editAdvanced, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainAdvanced',
      });
    },
    // 删除
    *deleteAdvanced({ payload }, { call, put }) {
      const response = yield call(deleteAdvanced, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainAdvanced',
      });
    },
    // 上下架
    *displayAdvanced({ payload }, { call, put }) {
      const response = yield call(displayAdvanced, payload);
      if (response.code !== 1) {
        return message.error(response.desc);
      }
      yield put({
        type: 'gainAdvanced',
      });
    },
  },
  reducers: {
    savePet(state, { payload }) {
      return { ...state, listData: payload.results || [] };
    },
    petTypeChange(state, { payload }) {
      return { ...state, petType: payload };
    },
    savePetKind(state, { payload }) {
      return { ...state, petKindList: payload.results || [] };
    },
    serverTypeChange(state, { payload }) {
      return { ...state, serverType: payload };
    },
    saveAdvanced(state, { payload }) {
      return { ...state, advancedList: payload.results || [] };
    },
  },
};
export default PetModel;
