<template>
        <a-upload
                name="file"
                :multiple="false"
                :action="submitUrl"
                :remove="removeFile"
                :headers="headers"
                @change="handleChange"
                :accept="acceptFile"
                :default-file-list="defaultFileList"
        >
            <a-button><a-icon type="upload" />{{buttonText}}</a-button>
        </a-upload>
</template>

<script>
  import store from '@/store'

  export default {
    //此组件用于在搜索框下面上传单个文件所用
    name:'UploadItem',
    props:{
      acceptFile:'', //允许上传的文件后缀
      submitUrl:'', //上传地址
      buttonText:{
        type:String,
        required: false,
        default: '上传文件'
      },
      defaultFileList:{
        type: Array,
        required: false
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
      //删除文件的时候调用，此方法通用
      removeFile(item){
        console.log('删除文件 : '+JSON.stringify(item))
        let fileName = item.name
        //元素的位置
        console.log('删除的文件名称 ： '+fileName)
        //请求后台接口，查询系统标签
        this.$delete('api/systemFile/deleteFileByFileName',{
          'name':fileName
        }).then((r) => {
          this.$message.success(`删除文件成功`);
        }).catch(() => {
          this.$message.error(`删除文件失败`);
        })
        this.$emit("removeFile",fileName)
      },
      handleChange(info) { //处理文件改变
        if (info.file.status == 'uploading') {
          console.log(info.file, info.fileList);
          this.$message.success(`正在上传`);
        }
        if (info.file.status == 'done') {
          console.log('done')
          console.log(JSON.stringify(info))
          this.$message.success(`上传成功`);
          info.fileList.splice(0,this.fileList.length)
          if(info.file.response){
            let url = info.file.response.data
            let fileName = info.file.name
            this.$emit("uploadFileSuccess",fileName)
          }
        } else if (info.file.status == 'error') {
          console.log('error')
          info.fileList.splice(0,this.fileList.length)
          this.$message.error(`上传失败`);
          this.$emit("uploadError")
        }
      },
    },
    created () {
      console.log(JSON.stringify('defaultFileList'+this.defaultFileList))
    }
  }
</script>

<style scoped>

</style>
