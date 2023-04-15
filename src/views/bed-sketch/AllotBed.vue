<template>
    <a-modal  :width="1000"
              height="auto"
              :visible="allotBedVisible" @cancel="handleCancelClick"
              cancelText="取消" okText="提交" @ok="handleSubmit">
        <a-form-model
                class="a-form-model"
                ref="ruleForm"
                :model="allotBedData"
                :rules="validateRules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @validate="validate">
          <div class="a-form-model-item-view">
            <a-form-model-item has-feedback class="a-form-model-item" ref="realName" label="姓名" prop="realName">
              <a-input
                  :disabled="true"
                  placeholder="请输入姓名"
                  v-model="allotBedData.realName"
                  @blur="
                       () => {
                         $refs.realName.onFieldBlur();
                       }"
              />
            </a-form-model-item>
            <a-form-model-item has-feedback class="a-form-model-item" ref="bedNum" label="床位号" prop="bedNum">
              <a-select
                  @change="handleBedNumChange"
                  v-model="allotBedData.bedNum"
                  :defaultValue="allotBedData.bedNum"
                  placeholder="请选择床位号">
                <a-select-option v-for="m in  allBedSketchOption" :key="m.value"
                                 :disabled="allotBedData.bedNum == m.value || m.useStatus">
                  {{m.text}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="a-form-model-item-view" v-if="showMoreStatus">
            <a-form-model-item has-feedback class="a-form-model-item" ref="nursingWorkerNum" label="护工编号" prop="nursingWorkerNum">
              <a-select
                  @change="handleNursingWorkerNumChange"
                  v-model="allotBedData.nursingWorkerNum"
                  :defaultValue="allotBedData.nursingWorkerNum"
                  placeholder="请选择护工编号">
                <a-select-option v-for="m in  authUserIdOption" :key="m.value">{{m.text}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
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
    labelCol: { span: 3 },
    wrapperCol: { span: 18 }
}
export default {
    name: 'AllotBed',
    components: {
        Editor:Editor,
        moment:moment
    },
    props: {
        allotBedVisible: {
            default: false
        },
        allotBedData: {
            required: true,
            default: {

            }
        },
    },
    data () {
        return {
            showMoreStatus:false,
            locale:locale,
            authUserIdOption:[

            ],
            allBedSketchOption:[],
            genderOption:this.$commonConstants.genderOption,
            submitUrl:'api/v1/oldSketch/allotBed', //提交URL
            timeFormat:'YYYY-MM-DD', //时间格式
            beginAndEndTimeFormat:'YYYY-MM', //时间格式
            uploadUrl: process.env.BASE_API+'/api/systemFile/uploadFile', //文件时上传
            //校验规则
            validateRules: {
                realName: [
                    { required: true, message: '请规范填写姓名', trigger: 'blur' }
                ],
                bedNum: [
                    { required: true, message: '请规范填写床位号', trigger: 'change' }
                ],
                nursingWorkerNum: [
                    { required: true, message: '请规范填写护工编号', trigger: 'blur' }
                ],
            },
            formItemLayout,
            dictDataList:[], //字典数据集合
            //上传文件的时候必须带上的token
            uploadHeader:{
                "Authentication":store.state.account.token
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
        async setOtherData(){
          this.authUserIdOption = await this.$commonConstants.authUserRoleSketchOption('NURSING_STAFF')
          this.allBedSketchOption = await this.$commonConstants.allBedSketchOption()
        },
        handleGenderChange(value){
          this.allotBedData.gender = value
        },
        onDischargedTimeChange(value, dateString){
          console.log('Selected Time: ', value);
          console.log('Formatted Selected Time: ', dateString);
          this.allotBedData.dischargedTime = dateString
        },
        onDischargedTimeOK(value){
          console.log('onOk: ', value);
        },
        onIntakeTimeChange(value, dateString){
          console.log('Selected Time: ', value);
          console.log('Formatted Selected Time: ', dateString);
          this.allotBedData.intakeTime = dateString
        },
        onIntakeTimeOK(value){
          console.log('onOk: ', value);
        },
        handleBedNumChange(value){
          this.allotBedData.bedNum = value
        },
        handleNursingWorkerNumChange(value){
          this.allotBedData.nursingWorkerNum = value
        },
        handleRegionChange(value){
            this.allotBedData.regionId = value
        },
        handleAuthUserChange(value){
            this.allotBedData.authUserId = value
        },
        onEndTimeChange(value, dateString){
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
            this.allotBedData.endTime = dateString
        },
        onBeginTimeChange(value, dateString){
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
            this.allotBedData.beginTime = dateString
        },
        onTimeOK(value){
            console.log('onOk: ', value);
        },
        moment, //时间处理
        handleCancel() {
            this.previewVisible = false;
        },
        validate(successStatus,object){
            console.log(successStatus)
            console.log(object)
        },
        resetForm() { //重置表单
            this.$refs.ruleForm.resetFields();
        },
        handleCancelClick(){
            this.reset();
            this.clearAll();
            this.$emit("close")
        },
        reset () {
            this.loading = false
            this.$refs.ruleForm.resetFields();
        },
        onClose () {
            this.reset();
            //清除所有图片内容
            this.clearAll();
            this.$emit('close')
        },
        clearAll(){
            console.log('clearAll')
            //清除所有文件内容
            this.authUserIdOption.splice(0,this.authUserIdOption.length);
        },

        handleSubmit () { //处理提交
            let that = this
            that.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    //从表单里面拿到值
                    this.$putBodyRequest(this.submitUrl, {
                        ...this.allotBedData
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
        allotBedVisible () {
            if (this.allotBedVisible) {
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
