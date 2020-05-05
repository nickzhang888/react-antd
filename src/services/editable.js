import { stringify } from 'qs';
import request from '@/utils/request';

export async function getEditableInfo(params) {
    return request(`/editable/editableInfo?${stringify(params)}`, {
        method: "GET",
    });
}


