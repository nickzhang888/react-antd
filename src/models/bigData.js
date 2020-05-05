import { queryFakeList, removeFakeList, addFakeList, updateFakeList } from '../services/bigData';

export default {
  namespace: 'bigData',

  state: {
    list: [
      {
        rowId: 94001,
        upId: null,
        name: '紫金一号',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 18000,
            detailList: [],
          },
          {
            date: '2019-05-04',
            position: 18000,
            detailList: [],
          },
          {
            date: '2019-05-05',
            position: 18000,
            detailList: [],
          },
          {
            date: '2019-05-06',
            position: 18000,
            detailList: [],
          },
        ],
      },
      {
        rowId: 1,
        upId: 94001,
        name: '托管户',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 4000,
            detailList: [],
          },
          {
            date: '2019-05-04',
            position: 4000,
            detailList: [],
          },
          {
            date: '2019-05-05',
            position: 4000,
            detailList: [],
          },
          {
            date: '2019-05-06',
            position: 4000,
            detailList: [],
          },
        ],
      },
      {
        rowId: 2,
        upId: 94001,
        name: '上清所',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 6000,
            detailList: [],
          },
          {
            date: '2019-05-04',
            position: 6000,
            detailList: [],
          },
          {
            date: '2019-05-05',
            position: 6000,
            detailList: [],
          },
          {
            date: '2019-05-06',
            position: 6000,
            detailList: [],
          },
        ],
      },
      {
        rowId: 3,
        upId: 94001,
        name: '中债登',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 8000,
            detailList: [],
          },
          {
            date: '2019-05-03',
            position: 8000,
            detailList: [],
          },
          {
            date: '2019-05-04',
            position: 8000,
            detailList: [],
          },
          {
            date: '2019-05-05',
            position: 8000,
            detailList: [],
          },
          {
            date: '2019-05-06',
            position: 8000,
            detailList: [],
          },
        ],
      },
      {
        rowId: 1001,
        upId: 1,
        name: '资金流入',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 1000,
            detailList: [],
          },
        ],
      },
      {
        rowId: 2001,
        upId: 2,
        name: '场外担保流入',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 3000,
            detailList: [],
          },
        ],
      },
      {
        rowId: 3001,
        upId: 3,
        name: '资金流入',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 3000,
            detailList: [],
          },
        ],
      },
      {
        rowId: 1001011,
        upId: 1001,
        name: '赎回交易',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 3000,
            detailList: [
              {
                key: 111,
                date: '2019-05-03',
                dealNo: '123456',
                code: '201314',
                name: 'corolla',
                balance: 3000,
                method: '融资回购',
              },
            ],
          },
        ],
      },
      {
        rowId: 3001011,
        upId: 3001,
        name: '回购交易',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 5000,
            detailList: [
              {
                key: 222,
                date: '2019-05-03',
                dealNo: '123456',
                code: '201314',
                name: 'fetch',
                balance: 5000,
                method: '融资回购',
              },
            ],
          },
        ],
      },
      {
        rowId: 2001011,
        upId: 2001,
        name: '采购交易',
        date: '2019-05-03',
        list: [
          {
            date: '2019-05-03',
            position: 3000,
            detailList: [
              {
                key: 333,
                date: '2019-05-03',
                dealNo: '123456',
                code: '201314',
                name: 'corolla',
                balance: 3000,
                method: '融资回购',
              },
            ],
          },
        ],
      },
    ],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
