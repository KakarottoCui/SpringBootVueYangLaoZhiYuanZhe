<template>
  <a-modal :width="1000" height="auto" :visible="editVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
    @ok="handleSubmit">
    <a-form-model class="a-form-model" ref="ruleForm" :model="itemEditData" :rules="validateRules" :label-col="labelCol"
      :wrapper-col="wrapperCol" @validate="validate">
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="timeOffBegin" label="请假开始时间" prop="timeOffBegin">
          <a-date-picker v-model="itemEditData.timeOffBegin" placeholder="请选择请假开始时间" @change="onTimeOffBeginChange"
            @ok="onTimeOffBeginOK" />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="timeOffEnd" label="请假结束时间" prop="timeOffEnd">
          <a-date-picker v-model="itemEditData.timeOffEnd" placeholder="请选择请假结束时间" @change="onTimeOffEndChange"
            @ok="onTimeOffEndOK" />
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="authUserId" label="志愿者" prop="authUserId">
          <a-select @change="handleNursingWorkerChange" v-model="itemEditData.authUserId"
            :defaultValue="itemEditData.authUserId" placeholder="请选择志愿者" style="width:100%">
            <a-select-option v-for="m in  authUserIdOption" :key="m.value">{{m.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="timeOffRemark" label="请假缘由" prop="timeOffRemark">
          <a-textarea style="width:100%" class="a-form-model-item-input" v-model="itemEditData.timeOffRemark" @blur="
                        () => {
                          $refs.timeOffRemark.onFieldBlur();
                        }" />
        </a-form-model-item>
      </div>
      <!--<div class="a-form-model-item-view">

            </div>-->
    </a-form-model>
  </a-modal>
</template>
<script>
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
  import Editor from '@/components/editor/Editor'
  import store from '@/store'
  import moment from 'moment'
  import baseUtils from '@/utils/baseUtils'
  moment.locale('zh-cn')

  const formItemLayout = {
    labelCol: {
      span: 3
    },
    wrapperCol: {
      span: 18
    }
  }
  export default {
    name: 'ItemEdit',
    components: {
      Editor: Editor,
      moment: moment,
      baseUtils: baseUtils,
    },
    props: {
      editVisible: {
        default: false
      },
      itemEditData: {
        required: true,
        default: {

        }
      },
    },
    data() {
      return {
        locale: locale,
        authUserIdOption: [],
        submitUrl: 'api/v1/nursingTimeOff/updateItem', //提交URL
        timeFormat: 'YYYY-MM-DD', //时间格式
        beginAndEndTimeFormat: 'YYYY-MM', //时间格式
        uploadUrl: process.env.BASE_API + '/api/systemFile/uploadFile', //文件时上传
        //校验规则
        validateRules: {
          authUserId: [{
            required: true,
            message: '请规范选择志愿者',
            trigger: 'change'
          }],
          timeOffBegin: [{
            required: true,
            message: '请规范填写请假开始时间',
            trigger: 'change'
          }],
          timeOffEnd: [{
            required: true,
            message: '请规范填写请假结束时间',
            trigger: 'change'
          }],
          timeOffRemark: [{
            required: true,
            message: '请规范填写请假缘由',
            trigger: 'blur'
          }],
          dataType: [{
            type: 'array',
            required: true,
            message: 'Please select at least one activity type',
            trigger: 'change',
          }, ],
          resource: [{
            required: true,
            message: 'Please select activity resource',
            trigger: 'change'
          }, ],
        },
        formItemLayout,
        dictDataList: [], //字典数据集合
        //上传文件的时候必须带上的token
        uploadHeader: {
          "Authentication": store.state.account.token
        },
        previewVisible: false,
        previewImage: '',
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 15,
        },
        loading: false,
      }
    },
    methods: {
      handleNursingWorkerChange(value) {
        this.itemEditData.authUserId = value
      },
      onTimeOffBeginChange(value, dateString) { //生日选择的时候触发
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.itemEditData.timeOffBegin = dateString
      },
      onTimeOffBeginOK(value) {
        console.log('onOk: ', value);
      },
      onTimeOffEndChange(value, dateString) { //生日选择的时候触发
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.itemEditData.timeOffEnd = dateString
      },
      onTimeOffEndOK(value) {
        console.log('onOk: ', value);
      },
      async setOtherData() {
        this.authUserIdOption = await this.$commonConstants.authUserRoleSketchOption('NURSING_STAFF')
      },
      handleRegionChange(value) {
        this.itemEditData.regionId = value
      },
      handleAuthUserChange(value) {
        this.itemEditData.authUserId = value
      },
      onEndTimeChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.itemEditData.endTime = dateString
      },
      onBeginTimeChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.itemEditData.beginTime = dateString
      },
      onTimeOK(value) {
        console.log('onOk: ', value);
      },
      moment, //时间处理
      handleCancel() {
        this.previewVisible = false;
      },
      validate(successStatus, object) {
        console.log(successStatus)
        console.log(object)
      },
      resetForm() { //重置表单
        this.$refs.ruleForm.resetFields();
      },
      handleCancelClick() {
        this.reset();
        this.clearAll();
        this.$emit("close")
      },
      reset() {
        this.loading = false
        this.$refs.ruleForm.resetFields();
      },
      onClose() {
        this.reset();
        //清除所有图片内容
        this.clearAll();
        this.$emit('close')
      },
      clearAll() {
        console.log('clearAll')
        //清除所有文件内容
        this.authUserIdOption.splice(0, this.authUserIdOption.length);
      },

      handleSubmit() { //处理提交
        let that = this
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            //格式化时间
            /*if(this.itemEditData.beginTime){
                this.itemEditData.beginTime = moment(this.itemEditData.beginTime).format(this.beginAndEndTimeFormat);
            }
            if(this.itemEditData.endTime){
                this.itemEditData.endTime = moment(this.itemEditData.endTime).format(this.beginAndEndTimeFormat);
            }*/
            this.loading = true
            //从表单里面拿到值
            this.$putBodyRequest(this.submitUrl, {
              ...this.itemEditData
            }).then(() => {
              this.loading = false
              this.resetForm()
              this.clearAll();
              this.reset()
              this.$emit('success')
            }).catch(() => {
              this.$message.error('更新出现错误')
              this.loading = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    watch: { //监控弹窗的变化
      editVisible() {
        if (this.editVisible) {
          this.setOtherData();
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /*使用~@引入*/
  @import "~@/utils/utils.less";
</style>