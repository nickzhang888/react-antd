import { getSelect, queryListData, sendService } from '@/services/dividend';

export default {
  namespace: 'dividend',

  state: {
    listData: {
      data: [],
      current: '',
      pageSize: '',
    },
    fundName: []
  },

  effects: {
    *getSelect({ payload, callback }, { call, put }) {
      const response = yield call(getSelect, payload);
      if (response) {
        if (response.httpStatus == 200) {
          yield put({
            type: 'saveSelect',
            payload: response,
          });
          return response;
        }
      }
    },
    *queryListData({ payload, callback }, { call, put }) {
      const response = yield call(queryListData, payload);
      if (response) {
        if (response.httpStatus == 200) {
          yield put({
            type: 'saveListData',
            payload: response,
          });
          return response;
        }
      }
    },
    *sendService({ payload, callback }, { call, put }) {
      const response = yield call(sendService, payload);
      return response
    },
  },

  reducers: {
    saveSelect(state, { payload }) {
      return {
        ...state,
        fundName: payload.data,
      };
    },
    saveListData(state, { payload }) {
      return {
        ...state,
        listData: payload.data,
      };
    },
  },
};
