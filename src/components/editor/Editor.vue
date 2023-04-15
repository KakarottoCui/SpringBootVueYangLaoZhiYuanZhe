<template>
    <div class="editor">
        <!--工具栏-->
        <div
          id="toolbar"
          ref="toolbar"
          class="toolbar"
        />
        <!--修改器-->
        <div
          :id="editorId"
          ref="editor"
          class="text"
        >
        </div>
    </div>
</template>

<script>
  import store from '@/store'
  import E from 'wangeditor'
  export default {
    name: 'Editor',
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      isClear: {
        type: Boolean,
        default: false
      },
      disable: {
        type: Boolean,
        default: false
      },
    },
    components:{
      store:store
    },
    data() {
      return {
        // uploadPath,
        editorId:Math.random().toString(36).slice(-8),
        editor: null,
        info_: null,
        //上传文件的时候必须带上的token
        uploadHeader:{
          "Authentication":store.state.account.token
        },
        uploadUrl: process.env.BASE_API+'/api/systemFile/uploadFileMixed', //文件时上传
      }
    },
    watch: {
      isClear(val) {
        // 触发清除文本域内容
        if (val) {
          this.editor.txt.clear()
          this.info_ = null
        }
      },
      value: function(value) {
        if (value !== this.editor.txt.html()) {
          this.editor.txt.html(this.value)
        }
      }
      // value为修改框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
    },
    mounted() {
      this.setEditor()
      this.editor.txt.html(this.value)
    },
    methods: {
      setEditor() {
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)
        //this.editor = new E("#toolbar", "#editor")
        this.editor.customConfig = this.editor.customConfig ? this.editor.customConfig : this.editor.config
        this.editor.customConfig.uploadImgShowBase64 = true // base 64 存储图片
        this.editor.customConfig.uploadImgServer = this.uploadUrl// 配置服务器端地址
        this.editor.customConfig.uploadImgHeaders = this.uploadHeader// 自定义 header
        this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
        this.editor.customConfig.uploadImgMaxSize = 500 * 1024 * 1024 // 将图片大小限制为 5M
        this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 6 张图片
        this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
        this.editor.customConfig.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
        this.editor.customConfig.pasteFilterStyle = false //关闭样式过滤
        this.editor.customConfig.pasteIgnoreImg = true //不忽略粘贴内容里面的图片
        this.editor.customConfig.colors = [
          '#000000',
          '#eeece0',
          '#1c487f',
          '#4d80bf',
          '#FF0000'
        ]
        // 配置菜单
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'splitLine', // 分割线
          'indent', // 缩进
          'lineHeight', // 行高
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'link', // 插入链接
          'list', // 列表
          'justify', // 对齐方式
          'quote', // 引用
          'emoticon', // 表情
          'image', // 插入图片
          'table', // 表格
          // 'video', // 插入视频
          'code', // 插入代码
          'undo', // 撤销
          'redo', // 重复
          'fullscreen' // 全屏
        ]
        this.editor.customConfig.uploadImgHooks = {
          fail: (xhr, editor, result) => {
            // 插入图片失败回调
          },
          success: (xhr, editor, result) => {
            // 图片上传成功回调
          },
          timeout: (xhr, editor) => {
            // 网络超时的回调
          },
          error: (xhr, editor) => {
            // 图片上传错误的回调
          },
          customInsert: (insertImg, result, editor) => {
            // 图片上传成功，插入图片的回调
            // result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
            console.log('富文本编辑器上传图片结果:'+JSON.stringify(result))
            if(result.data){
              const url = this.$commonConstants.handleImageUrl(result.data)
              insertImg(url)
            }
          }
        }
        this.editor.customConfig.onchange = (html) => {
          this.info_ = html // 绑定当前值
          this.$emit('change', this.info_) // 将内容同步到父组件中
        }
        // 创建富文本修改器
        this.editor.create()
      }
    }
  }
</script>

<style lang="less">
    .editor {
        width: 100%;
        margin: 0 auto;
        position: relative;
        z-index: 1;
    }
    .toolbar {
        border: 1px solid #ccc;
    }
    .text {
        border: 1px solid #ccc;
        min-height: 500px;
        width: 100%;
        flex-wrap:wrap; //解决粘贴内容过长的问题
        p {
            white-space: pre-wrap; //解决粘贴内容过长的问题
        }
    }
</style>
