import { queryList } from '@/services/bar';

export default {
  namespace: 'bar',
  state: {
    data: {
      1: [],
      2: [],
      3: [],
      4: [],
    },
  },

  effects: {
    *search({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'query',
        payload: response
      });
      return response
    },
  },

  reducers: {
    query(state, { payload }) {
      return {
        ...state,
        data: payload.data,
      };
    },
  },
};
