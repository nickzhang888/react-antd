import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/batchTable/querylist`,{
    method:"POST",
    body:params
  });
}
export async function addList(params) {
  return request(`/batchTable/addList`,{
    method:"POST",
    body:params
  });
}
export async function updateList(params) {
  return request(`/batchTable/updateList`,{
    method:"POST",
    body:params
  });
}

