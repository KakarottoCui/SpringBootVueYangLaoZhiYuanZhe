<template>
        <a-upload
                name="file"
                :multiple="false"
                :action="importUrl"
                :headers="headers"
                @change="handleChange"
                :accept="acceptFile"
        >
            <a-button><a-icon type="upload" />{{buttonText}}</a-button>
        </a-upload>
</template>

<script>
  import store from '@/store'

  export default {
    name:'ImportExcel',
    props:{
      acceptFile:'', //允许上传的文件后缀
      importUrl:'', //上传地址
      buttonText: '', //按钮的名字
      buttonText:{
        type:String,
        required: false,
        default: '导入数据'
      }
    },
    data() {
      return {
        headers: {
          "Authentication":store.state.account.token
        },
        fileList: [],
        uploading: false,
      };
    },
    methods: {
      handleChange(info) { //处理文件改变
        if (info.file.status == 'uploading') {
          console.log(info.file, info.fileList);
          this.$message.success(`正在导入`);
        }
        if (info.file.status == 'done') {
          console.log(JSON.stringify(info))
          let response = info.file.response
          if(!baseUtils.isNull(response)){
            if(response.code != this.$successCode){
              this.$message.error(response.message);
            }else{
              this.$message.success(response.message);
            }
          }else{
            this.$message.success(`导入成功`);
          }
          info.fileList.splice(0,info.fileList.length)
          this.$emit("importSuccess")
        } else if (info.file.status == 'error') {
          console.log('error')
          info.fileList.splice(0,info.fileList.length)
          this.$message.error(`导入失败`);
          this.$emit("importError")
        }
      },
    },
  }
</script>

<style scoped>

</style>
