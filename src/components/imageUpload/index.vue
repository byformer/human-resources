<template>
<div>
    <!-- file-list是上传的文件列表 -->
  <el-upload
    list-type="picture-card"
    :on-preview="preview"
    :file-list="filelist"
    action="#"
    :limit="1"
    :class="{ disabled : fileComputed }"
    :on-remove="headRemove"
    :on-change="changeFile"
    :before-upload="beforeUpload"
    :http-request="upload"
  >
    <i class="el-icon-plus" />
  </el-upload>
  <el-progress v-if="showPercent" style="width:180px" :percentage="percent" />
  <el-dialog :visible.sync="showDialog" title="图片预览" >
    <img :src="imgUrl" alt="" style="width:100%">
  </el-dialog>
</div>
  
</template>

<script>
import COS from 'cos-js-sdk-v5'  // 引入腾讯云cos包
//   实例化
  const cos = new COS({
      SecretId:'AKID4xhDTix4ziEVaT93jANMAqJXaUBmCNNC', // 身份识别id
      SecretKey:'lNl1AIGzSiijW4PjvwmSFZLxMXSMB4oW'    //  身份密钥
    })
export default {
  data() {
    return {
      filelist: [], 
         showDialog:false,
          imgUrl:'', // 储存图片地址
          currentFileUid: '',  // 记录上传图片的id
          percent:0, // 记录当前百分比
          showPercent:false,
    }
  },
  computed:{
    fileComputed(){
        // 如果他为true
        return this.filelist.length === 1
    }
  },
  methods: {
     // 点击预览事件
    preview(file) {
        this.imgUrl = file.url
        this.showDialog = true

    },
    
    headRemove(file,){ 
         this.filelist = this.filelist.filter(item => item.uid !== file.uid) // 将当前的排除在外
        // this.filelist = filelist   第二种方法 传个filelist
    },
    changeFile(file,filelist){
     this.filelist = filelist.map(item => item)
    },
    beforeUpload(file){
        // console.log(file);
        // 检查文件类型
        const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png',]
        if(!types.some(item => item === file.type)){
            // 如果不存在
            this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
            return false // 上传终止
        }
        // 检查文件的大小，限制文件大小为 5M
        const maxSize = 5 * 1024 * 1024
        if(file.size > maxSize){
            // 超过了限制文件的大小
            this.$message.error('上传的图片大小不能大于5M')
            return false
        }
        this.currentFileUid =file.uid
        this.showPercent = true
        return true  // 最后一定要return一个true
    },
    // 进行上传操作
    /* upload(parmas){
       if(parmas.file){
        // 执行上传操作
        cos.putObject({
            // 上传到腾讯云 => 哪个存储桶
            Bucket:'resources-1316509798', // 储存桶
            Region:"ap-nanjing", // 地域
            key:parmas.file.name, // 文件名
            Body:parmas.file,   // 要上传的对象
            StorageClass:'STANDARD', // 上传的模式类型
        },
        
        )
       }
    } */
        // 进行上传操作
    upload(params) {
    //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'ikun-1316509798', // 存储桶
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          onProgress:(parmas)=>{
               this.percent = parmas.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        },(err, data)=> {
          // data返回数据之后 应该如何处理
        //   console.log(err || data)
          if(!err && data.statusCode=== 200){

            this.filelist = this.filelist.map(item =>{
                if(item.uid === this.currentFileUid){
                    // 将成功的值返回
                    return {url: 'http://' + data.Location,upload:true}
                    // upload 为true表示这张图片已经上传完毕
                }
                return item
            })
            // 将成功的值回写
            // 关闭进度条、重置百分比
            setTimeout(() => {
                this.showPercent = false
            this.percent = 0
            }, 1000);
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
    display: none;
}
</style>