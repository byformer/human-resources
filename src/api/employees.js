import request from "@/utils/request"

// 获取员工简单列表

export function getSimple(){
    return request({
        url:'/sys/user/simple',
    })
}

/**
 * 获取员工的综合列表数据
 * ***/
 export function getEmployeeList(params) {
    return request({
      url: '/sys/user',
      params
    })
  }
  
/**
 * 删除员工接口
 * ****/

 export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

// 新增员工
export function addEmployee(data){
   return request({
      url:'/sys/user',
      method:'POST',
      data
   })
}
/** *
 *  封装一个批量导入员工的接口
 *
 * ***/

 export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}
  
