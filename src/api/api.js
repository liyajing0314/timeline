import { axios } from '@/utils/request'

/**
 * 添加
 * @param {Object} parameter
 */
export function sequenceAdd(parameter) {
  return axios({
    url: '/sequence/add',
    method: 'POST',
    data: parameter
  })
}
/**
 * 编辑
 * @param {Object} parameter
 */
export function sequenceEdit(parameter) {
  return axios({
    url: '/sequence/edit',
    method: 'PUT',
    data: parameter
  })
}
/**
 * 列表
 * @param {Object} parameter
 */
export function sequenceList(parameter) {
  return axios({
    url: '/sequence/list',
    method: 'GET',
    params: parameter
  })
}
/**
 * 详情
 * @param {Object} parameter
 */
export function sequenceQueryById(parameter) {
  return axios({
    url: '/sequence/queryById',
    method: 'GET',
    params: parameter
  })
}
/**
 * 删除
 * @param {Object} parameter
 */
export function sequenceDelete(parameter) {
  return axios({
    url: '/sequence/delete',
    method: 'DELETE',
    params: parameter
  })
}
/**
 * 上传文件
 * @param {Object} parameter
 */
export function uploadFile(parameter) {
  return axios({
    url: '/file/uploadFile',
    method: 'POST',
    data: parameter
  })
}