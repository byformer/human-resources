<template>
  <UploadExcel :on-success="success" />
</template>

<script>
import {importEmployee} from "@/api/employees"
export default {
  methods: {
   async success({header,results}){
          // 中文导成英文
        // username: '',  姓名
        // mobile: '',   手机号
        // formOfEmployment: '',
        // workNumber: '',  工号
        // departmentName: '',
        // timeOfEntry: '',  入职时间
        // correctionTime: '' 转正日期

           const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber'
        }
  
      //   let arr = []
      // results.forEach(item => {
      //   let userinfo = {}
      //     Object.keys(item).forEach(key =>{
      //       // 现在key是中文
      //     userinfo[userRelations[key]] = item[key]   // 将原来中文对应的值，赋值给原来英文对应的值
      //     })
      //     arr.push(userinfo)
      // });

      let newArr = results.map(item =>{
          let userinfo = {}
        Object.keys(item).forEach(key =>{
          if(userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime'){
            // 后端接口限制了 不能是字符串， 要求转换为时间类型
            userinfo[userRelations[key]] = new Date(this.formatDate(item[key]),'/') // 只有这样才能存入数据库
          }else{
            userinfo[userRelations[key]] = item[key]   // 将原来中文对应的值，赋值给原来英文对应的值
          }
            
        })
        console.log(userinfo);
        return userinfo

       })
      
       try {
      await importEmployee(newArr)  // 接收一个数组
      this.$message.success("导入excel成功")
      this.$router.back() // 回到上一个页面
       } catch (error) {
          console.log(error);
       }
     
    },
    // 转换excel日期格式
      formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>
</style>