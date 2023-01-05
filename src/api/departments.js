import request from "@/utils/request"

// 获取组织架构数据
export function getDepartments (){
    return request({
        url:"/company/department",
        method:'GET'
    })
}

//  删除组织架构部门

export function delDepartments(id){
    return request({
        url:`/company/department/${id}`,
        method:'delete',  // 接口满足result接口规范

    })
}
// 新增部门
export function addDepartments(data){
   return request({
        method:"POST",
        url:"/company/department",
        data
    })
}