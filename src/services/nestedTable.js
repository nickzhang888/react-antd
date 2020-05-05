import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryList(params) {
  return request(`/api/nestQuery`,{
        method:"POST",
        body:params
  });
}