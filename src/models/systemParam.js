import { queryListData, sendService } from '@/services/dividend';
import moment from "moment"
export default {
    namespace: 'systemParam',
    state: {
        list: [
            { "id": 1, "key": "MaxDate", "describe": "全局最大日期", "value": "20190516", "modify": "1", "type": "4", "valueBound": null, "order": 1, "isRequired": "1" }, { "id": 7, "key": "ExportFTPIp", "describe": "文件导出FTPIP", "value": "168.63.66.66", "modify": "1", "type": "0", "valueBound": null, "order": 2, "isRequired": "0" }, { "id": 8, "key": "ExportFTPUser", "describe": "文件导出FTP用户名", "value": "11122225", "modify": "1", "type": "0", "valueBound": null, "order": 3, "isRequired": "0" }, { "id": 9, "key": "ExportFTPPassword", "describe": "文件导出FTP密码", "value": "ftp", "modify": "1", "type": "0", "valueBound": null, "order": 4, "isRequired": "0" }, { "id": 10, "key": "ExportFTPPath", "describe": "文件导出FTP路径", "value": "talc/YYYYMMDD/", "modify": "1", "type": "0", "valueBound": null, "order": 5, "isRequired": "0" }, { "id": 11, "key": "ExportBackPath", "describe": "文件导出后台路径", "value": "/home/appadmin/fileData", "modify": "0", "type": "0", "valueBound": null, "order": 6, "isRequired": "0" }, { "id": 12, "key": "NeedCheckBusiness", "describe": "需要审核的交易类型", "value": ["03:赎回", "74:分红"], "modify": "1", "type": "3", "valueBound": ["01:成立", "02:申购", "03:赎回", "17:撤单", "74:分红"], "order": 7, "isRequired": "0" }, { "id": 13, "key": "test", "describe": "test-单选", "value": "01:单选一", "modify": "1", "type": "2", "valueBound": ["01:单选一", "02:单选二"], "order": 8, "isRequired": "1" }, { "id": 18, "key": "check", "describe": "test-勾选", "value": "1", "modify": "1", "type": "1", "valueBound": "01:勾选一;02:勾选二", "order": 9, "isRequired": "0" }
        ],
        editList: []
    },

    effects: {
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
        *saveEdit({ payload, callback }, { call, put }) {
            const response = yield call(sendService, payload);
            yield put({
                type: 'saveListData',
                payload: response,
            });
            return response
        },
    },

    reducers: {
        modifyParam(state, { payload }) {
            const { list, editList } = state
            let key, value;
            for (let index in payload) {
                key = index
                value = payload[index]
            }
            if (Object.prototype.toString.call(value) === "[object Object]") {
                value = moment(value).format("YYYY-MM-DD")
            }
            const newItem = list.find(each => each.key == key)
            // 查找改变的数据里是否已有该项
            const index = editList.findIndex(each => each.key == key)
            if (index > -1) {
                editList[index].value = value
            } else {
                newItem.value = value
                editList.push(newItem)
            }

            return {
                ...state,
                editList
            };
        },
        saveListData(state, { payload }) {
            return {
                ...state,
                editList: [],
            };
        },
    },
};
