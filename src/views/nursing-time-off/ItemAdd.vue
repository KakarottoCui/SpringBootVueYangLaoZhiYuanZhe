<template>
  <a-modal :width="1000" height="auto" :visible="addVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
           @ok="handleSubmit">
    <a-form-model class="a-form-model" ref="ruleForm" :model="itemAddData" :rules="validateRules"
                  :label-col="labelCol" :wrapper-col="wrapperCol" @validate="validate">
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="timeOffBegin" label="请假开始时间"
                           prop="timeOffBegin">
          <a-date-picker v-model="itemAddData.timeOffBegin" placeholder="请选择请假开始时间"
                         @change="onTimeOffBeginChange" @ok="onTimeOffBeginOK"/>
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="timeOffEnd" label="请假结束时间"
                           prop="timeOffEnd">
          <a-date-picker v-model="itemAddData.timeOffEnd" placeholder="请选择请假结束时间" @change="onTimeOffEndChange"
                         @ok="onTimeOffEndOK"/>
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="authUserId" label="志愿者"
                           prop="authUserId">
          <a-select @change="handleNursingWorkerChange" v-model="itemAddData.authUserId"
                    :defaultValue="itemAddData.authUserId" placeholder="请选择志愿者" style="width:100%">
            <a-select-option v-for="m in  authUserIdOption" :key="m.value">{{ m.text }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="timeOffRemark" label="请假缘由"
                           prop="timeOffRemark">
          <a-textarea style="width:100%" class="a-form-model-item-input" v-model="itemAddData.timeOffRemark"
                      @blur="
                      () => {
                        $refs.timeOffRemark.onFieldBlur();
                      }"/>
        </a-form-model-item>
      </div>
    </a-form-model>
  </a-modal>
</template>
<script>
import locale from 'ant-design-vue/lib/date-picker/locale/zh_CN'
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
  name: 'ItemAdd',
  props: {
    addVisible: {
      default: false
    }
  },
  components: {
    Editor: Editor,
    moment: moment,
    baseUtils: baseUtils,
  },
  data() {
    return {
      locale: locale,
      authUserIdOption: [],
      submitUrl: 'api/v1/nursingTimeOff/addItem', //提交URL
      timeFormat: 'YYYY-MM-DD', //时间格式
      beginAndEndTimeFormat: 'YYYY-MM', //时间格式
      itemAddData: {},
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
        },],
        resource: [{
          required: true,
          message: 'Please select activity resource',
          trigger: 'change'
        },],
      },
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
      formItemLayout,
      validateStatus: '',
      help: '',
    }
  },
  methods: {
    handleNursingWorkerChange(value) {
      this.itemAddData.authUserId = value
    },
    onTimeOffBeginChange(value, dateString) { //生日选择的时候触发
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.itemAddData.timeOffBegin = dateString
    },
    onTimeOffBeginOK(value) {
      console.log('onOk: ', value);
    },
    onTimeOffEndChange(value, dateString) { //生日选择的时候触发
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.itemAddData.timeOffEnd = dateString
    },
    onTimeOffEndOK(value) {
      console.log('onOk: ', value);
    },
    async setOtherData() {
      this.authUserIdOption = await this.$commonConstants.authUserRoleSketchOption('NURSING_STAFF')
    },
    handleRegionChange(value) {
      this.itemAddData.regionId = value
    },
    handleAuthUserChange(value) {
      this.itemAddData.authUserId = value
    },
    onEndTimeChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.itemAddData.endTime = dateString
    },
    onBeginTimeChange(value, dateString) {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
      this.itemAddData.beginTime = dateString
    },
    onTimeOK(value) {
      console.log('onOk: ', value);
    },
    moment, //时间处理
    handleCancel() {
      this.previewVisible = false;
    },
    //删除文件集合里面的文件
    removeFileFromList(arrayList, uid) {
      if (arrayList && uid) {
        let newArr = arrayList.reduce((total, current) => {
          current.uid !== uid && total.push(current);
          return total;
        }, []);
        return newArr;
      }
    },
    onClose() {
      this.resetForm()
      this.$emit('close')
    },
    clearAll() {
      console.log('clearAll')
      //清除所有文件内容
      this.authUserIdOption.splice(0, this.authUserIdOption.length);
      this.itemAddData = {}
    },
    validate(successStatus, object) {
      console.log(successStatus)
      console.log(object)
    },
    handleCancelClick() {
      this.resetForm();
      this.clearAll();
      this.$emit("close")
    },
    resetForm() { //重置表单
      this.$refs.ruleForm.resetFields();
    },
    handleSubmit() { //处理提交
      let that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          //格式化时间
          /*if(this.itemAddData.beginTime){
              this.itemAddData.beginTime = moment(this.itemAddData.beginTime).format(this.beginAndEndTimeFormat);
          }
          if(this.itemAddData.endTime){
              this.itemAddData.endTime = moment(this.itemAddData.endTime).format(this.beginAndEndTimeFormat);
          }*/
          this.loading = true
          //从表单里面拿到值
          this.$postBodyRequest(this.submitUrl, {
            ...this.itemAddData
          }).then((res) => {
            let data = res.data
            console.log(JSON.stringify(data))
            if (data && data.code == 200) {
              this.loading = false
              this.resetForm()
              this.clearAll();
              this.$emit('success')
            }
          }).catch((err) => {
            this.$message.error(err.message);
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  mounted() {

  },
  computed: {
    $video() {
      return this.$refs.vueMiniPlayer.$video;
    }
  },
  watch: {
    addVisible() {
      if (this.addVisible) {
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