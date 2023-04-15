<template>
  <a-modal :width="1000" height="auto" :visible="editVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
    @ok="handleSubmit">
    <a-form-model class="a-form-model" ref="ruleForm" :model="itemEditData" :rules="validateRules" :label-col="labelCol"
      :wrapper-col="wrapperCol" @validate="validate">
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="realName" label="姓名" prop="realName">
          <a-input placeholder="请输入姓名" v-model="itemEditData.realName" @blur="
                       () => {
                         $refs.realName.onFieldBlur();
                       }" />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="gender" label="性别" prop="gender">
          <a-select @change="handleGenderChange" v-model="itemEditData.gender" :defaultValue="itemEditData.gender"
            placeholder="请选择性别">
            <a-select-option v-for="m in  genderOption" :key="m.value">{{m.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="bodyState" label="身体状况" prop="bodyState">
          <a-input placeholder="请输入身体状况" v-model="itemEditData.bodyState" @blur="
                       () => {
                         $refs.bodyState.onFieldBlur();
                       }" />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="age" label="年龄" prop="age">
          <a-input placeholder="请输入年龄" v-model="itemEditData.age" @blur="
                         () => {
                           $refs.age.onFieldBlur();
                         }" />
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="censusRegister" label="户籍" prop="censusRegister">
          <a-input placeholder="请输入户籍" v-model="itemEditData.censusRegister" @blur="
                         () => {
                           $refs.censusRegister.onFieldBlur();
                         }" />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="idCardNum" label="身份证号码" prop="idCardNum">
          <a-input placeholder="请输入身份证号码" v-model="itemEditData.idCardNum" @blur="
                       () => {
                         $refs.idCardNum.onFieldBlur();
                       }" />
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="contacts" label="联系人" prop="contacts">
          <a-input placeholder="请输入联系人" v-model="itemEditData.contacts" @blur="
                         () => {
                           $refs.contacts.onFieldBlur();
                         }" />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="contactsPhone" label="联系人号码"
          prop="contactsPhone">
          <a-input placeholder="请输入联系人号码" v-model="itemEditData.contactsPhone" @blur="
                       () => {
                         $refs.contactsPhone.onFieldBlur();
                       }" />
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="homeAddress" label="家庭住址" prop="homeAddress">
          <a-input placeholder="请输入家庭住址" v-model="itemEditData.homeAddress" @blur="
                         () => {
                           $refs.homeAddress.onFieldBlur();
                         }" />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="nursingWorkerNum" label="志愿者">
          <a-select @change="handleNursingWorkerNumChange" v-model="itemEditData.nursingWorkerNum"
            :defaultValue="itemEditData.nursingWorkerNum" placeholder="请选择志愿者">
            <a-select-option v-for="m in  authUserIdOption" :key="m.value">{{m.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">

        <a-form-model-item has-feedback class="a-form-model-item" ref="intakeTime" label="登记时间" prop="intakeTime">
          <a-date-picker v-model="itemEditData.intakeTime" placeholder="请选择登记时间" @change="onIntakeTimeChange"
            @ok="onIntakeTimeOK" />
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
      moment: moment
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
        authUserIdOption: [

        ],
        allBedSketchOption: [],
        genderOption: this.$commonConstants.genderOption,
        submitUrl: 'api/v1/oldSketch/updateItem', //提交URL
        timeFormat: 'YYYY-MM-DD', //时间格式
        beginAndEndTimeFormat: 'YYYY-MM', //时间格式
        uploadUrl: process.env.BASE_API + '/api/systemFile/uploadFile', //文件时上传
        //校验规则
        validateRules: {
          realName: [{
            required: true,
            message: '请规范填写姓名',
            trigger: 'blur'
          }],
          gender: [{
            required: true,
            message: '请规范填写性别',
            trigger: 'blur'
          }],
          age: [{
            required: true,
            message: '请规范填写年龄',
            trigger: 'blur'
          }],
          bodyState: [{
            required: true,
            message: '请规范填写身体状况',
            trigger: 'blur'
          }],
          censusRegister: [{
            required: true,
            message: '请规范填写户籍',
            trigger: 'blur'
          }],
          idCardNum: [{
            required: true,
            message: '请规范填写身份证号码',
            trigger: 'blur'
          }],
          contacts: [{
            required: true,
            message: '请规范填写联系人',
            trigger: 'blur'
          }],
          contactsPhone: [{
            required: true,
            message: '请规范填写联系人号码',
            trigger: 'blur'
          }],
          homeAddress: [{
            required: true,
            message: '请规范填写家庭住址',
            trigger: 'blur'
          }],
          bedNum: [{
            required: true,
            message: '请规范填写床位号',
            trigger: 'blur'
          }],
          nursingWorkerNum: [{
            required: true,
            message: '请选择志愿者',
            trigger: 'blur'
          }],
          intakeTime: [{
            required: true,
            message: '请选择登记时间',
            trigger: 'change'
          }],
          dataType: [{
            type: 'array',
            required: true,
            message: '请至少选择一条数据',
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
      async setOtherData() {
        this.authUserIdOption = await this.$commonConstants.authUserRoleSketchOption('NURSING_STAFF')
      },
      handleGenderChange(value) {
        this.itemEditData.gender = value
      },
      onIntakeTimeChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.itemEditData.intakeTime = dateString
      },
      onIntakeTimeOK(value) {
        console.log('onOk: ', value);
      },
      handleBedNumChange(value) {
        this.itemEditData.bedNum = value
      },
      handleNursingWorkerNumChange(value) {
        this.itemEditData.nursingWorkerNum = value
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
            if (this.itemEditData.intakeTime) {
              this.itemEditData.intakeTime = moment(this.itemEditData.intakeTime).format(this.timeFormat);
            }
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