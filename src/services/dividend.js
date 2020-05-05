import { stringify } from 'qs';
import request from '@/utils/request';

export async function getSelect(params) {
  return request(`/dividend/getSelect`,{
        method:"POST",
        body:params
  });
}
export async function queryListData(params) {
  return request(`/dividend/getList`,{
        method:"POST",
        body:params
  });
}
export async function sendService(params) {
  return request(`/dividend/sendService`,{
        method:"POST",
        body:params
  });
}