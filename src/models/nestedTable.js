import { queryList } from '@/services/nestedTable';

export default {
  namespace: 'nestedTable',

  state: {
    data: {
      current: "",
      pageSize: "",
      total: "",
      dataSource: [],
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'query',
        payload: response,
      });
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
