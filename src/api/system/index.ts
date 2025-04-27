/**
 * @Author: Yuhior
 * @Date: 2024/12/25
 * @LastEditors: author
 * @Description: 获取系统参数
 */

import { request } from '@/utils/http'

export interface BasicResponseModel<T = any> {
	result: number
	message: string
	data: T
}

/**
 * 获取上传参数
 * @param data {}
 */
export const getAppVars = (data) => request.post('/limeResourceRuleFindList', {})
/**
 * 获取展览标签
 */
export const getNpCategoryList = () => request.post('/npCategoryList')
