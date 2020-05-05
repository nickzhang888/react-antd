import { getEditableInfo } from '@/services/editable';

export default {
    namespace: 'editable',

    state: {
        listData: {
            data: [],
            current: "",
            pageSize: ""
        },
    },

    effects: {
        *getEditableInfo({ payload, callback }, { call, put }) {
            const response = yield call(getEditableInfo, payload);
            yield put({
                type: 'queryInfo',
                payload: response
            });
            return response
        },
    },

    reducers: {
        queryInfo(state, { payload }) {
            return {
                ...state,
                listData: payload.data,
            };
        },
    },
};
