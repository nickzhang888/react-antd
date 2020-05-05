import request from '@/utils/request';
/**
 * 登录
 * 
 */
export async function login(params) {
  return request('/api/login',{
    method:"POST",
    body:params
  });
}

/**
 * 退出登录
 */
export async function logout(params) {
  return request('/api/logout',{
    method:"POST",
    body:params
  })
}
