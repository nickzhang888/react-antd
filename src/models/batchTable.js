import { queryList, removeList, addList, updateList } from '@/services/batchTable';

export default {
  namespace: 'batchTable',

  state: {
    listData: {
      data: [],
      current: "",
      pageSize: ""
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'query',
        payload: response
      });
      return response
    },
    *updateList({ payload, callback }, { call, put, select }) {
      const response = yield call(updateList, payload);
      if (response.httpStatus == 200) {
        yield select(state => {
          const { data } = state.batchTable.listData
          let index = data.findIndex(item => item.id == payload.id)
          data[index] = payload
        })
      }
      // yield put({
      //   type: 'update',
      //   payload: data
      // });
      // return response
    },
    *addList({ payload, callback }, { call, put }) {
      const response = yield call(addList, payload);
      yield put({
        type: 'add',
        payload: response
      });
      return response
    },
    *deleteList({ payload, callback }, { call, put, }) {
      console.log(111)
      yield put({
        type: 'delete',
        payload
      })
    },
  },

  reducers: {
    query(state, { payload }) {
      return {
        ...state,
        listData: payload.list,
      };
    },
    // update(state, { payload }) {
    //   return {
    //     ...state,
    //     listData,
    //   };
    // },
    delete(state, { payload }) {
      const { listData } = state
      const { data } = state.listData
      let newData = data.filter(item => item.id !== payload)
      return {
        ...state,
        listData: { ...listData, data: newData },
      };
    },
  },
};
