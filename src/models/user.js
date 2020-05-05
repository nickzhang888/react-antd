import { login, logout } from '../services/user';
import router from 'umi/router';
import storage from '@/utils/localStorage';

const defaultState = {
  loginErr: false,
  user: {},
  title: '',
  menuName: ''

};

export default {
  namespace: 'user',
  state: defaultState,
  effects: {
    *login({ payload }, { put, select, call }) {
      const res = yield call(login, payload);
      // 当用户名和密码匹配上才给登录
      if (res.httpStatus == 200) {
        yield put({
          type: 'setLoginErr',
          payload: false,
        });
        yield put({
          type: 'setUser',
          payload: res,
        });
        router.push('/');
        storage.add('user', res);
      } else {
        yield put({
          type: 'setLoginErr',
          payload: true,
        });
      }
    },
    *logout(_, { call, put }) {
      const res = yield call(logout);
      if (res) {
        yield put({
          type: 'setUser',
          payload: {},
        });
        storage.remove('user');
        // localStorage.removeItem("menuName")
        // localStorage.removeItem("title")
        router.push('/login');
      }
    },
  },

  reducers: {
    setLoginErr(state, { payload }) {
      return {
        ...state,
        loginErr: payload,
      };
    },
    setUser(state, { payload }) {
      return {
        ...state,
        user: payload,
      };
    },
    switchMenu(state, { payload }) {
      storage.add('menuName', payload.menuName);
      storage.add('title', payload.title);
      return {
        ...state,
        menuName: payload.menuName,
        title: payload.title,
      };
    },
  },
};
