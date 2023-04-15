<template>
    <a-modal  :width="1000"
              height="auto" :visible="addVisible" @cancel="handleCancelClick"
              cancelText="取消" okText="提交" @ok="handleSubmit">
        <a-form-model
                class="a-form-model"
                ref="ruleForm"
                :model="itemAddData"
                :rules="validateRules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @validate="validate">
                <div class="a-form-model-item-view">
                  <a-form-model-item has-feedback class="a-form-model-item" ref="realName" label="姓名" prop="realName">
                    <a-input
                        placeholder="请输入姓名"
                        v-model="itemAddData.realName"
                        @blur="
                       () => {
                         $refs.realName.onFieldBlur();
                       }"
                    />
                  </a-form-model-item>
                  <a-form-model-item has-feedback class="a-form-model-item" ref="gender" label="性别" prop="gender">
                    <a-select @change="handleGenderChange"
                              v-model="itemAddData.gender"
                              :defaultValue="itemAddData.gender"
                              placeholder="请选择性别">
                      <a-select-option v-for="m in  genderOption" :key="m.value">{{m.text}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </div>
                <div class="a-form-model-item-view">
                  <a-form-model-item has-feedback class="a-form-model-item" ref="bodyState" label="身体状况" prop="bodyState">
                    <a-input
                        placeholder="请输入身体状况"
                        v-model="itemAddData.bodyState"
                        @blur="
                       () => {
                         $refs.bodyState.onFieldBlur();
                       }"
                    />
                  </a-form-model-item>
                  <a-form-model-item has-feedback class="a-form-model-item" ref="age" label="年龄" prop="age">
                    <a-input
                        placeholder="请输入年龄"
                        v-model="itemAddData.age"
                        @blur="
                         () => {
                           $refs.age.onFieldBlur();
                         }"
                    />
                  </a-form-model-item>
                </div>
                <div class="a-form-model-item-view">
                  <a-form-model-item has-feedback class="a-form-model-item" ref="censusRegister" label="户籍" prop="censusRegister">
                    <a-input
                        placeholder="请输入户籍"
                        v-model="itemAddData.censusRegister"
                        @blur="
                         () => {
                           $refs.censusRegister.onFieldBlur();
                         }"
                    />
                  </a-form-model-item>
                  <a-form-model-item has-feedback class="a-form-model-item" ref="idCardNum" label="身份证号码" prop="idCardNum">
                    <a-input
                        placeholder="请输入身份证号码"
                        v-model="itemAddData.idCardNum"
                        @blur="
                       () => {
                         $refs.idCardNum.onFieldBlur();
                       }"
                    />
                  </a-form-model-item>
                </div>
                <div class="a-form-model-item-view">
                  <a-form-model-item has-feedback class="a-form-model-item" ref="contacts" label="联系人" prop="contacts">
                    <a-input
                        placeholder="请输入联系人"
                        v-model="itemAddData.contacts"
                        @blur="
                         () => {
                           $refs.contacts.onFieldBlur();
                         }"
                    />
                  </a-form-model-item>
                  <a-form-model-item has-feedback class="a-form-model-item" ref="contactsPhone" label="联系人号码" prop="contactsPhone">
                    <a-input
                        placeholder="请输入联系人号码"
                        v-model="itemAddData.contactsPhone"
                        @blur="
                       () => {
                         $refs.contactsPhone.onFieldBlur();
                       }"
                    />
                  </a-form-model-item>
                </div>
                <div class="a-form-model-item-view">
                  <a-form-model-item has-feedback class="a-form-model-item" ref="homeAddress" label="家庭住址" prop="homeAddress">
                    <a-input
                        placeholder="请输入家庭住址"
                        v-model="itemAddData.homeAddress"
                        @blur="
                         () => {
                           $refs.homeAddress.onFieldBlur();
                         }"
                    />
                  </a-form-model-item>
                  <a-form-model-item has-feedback class="a-form-model-item" ref="nursingWorkerNum" label="分配志愿者" prop="nursingWorkerNum">
                    <a-select
                        @change="handleNursingWorkerNumChange"
                        v-model="itemAddData.nursingWorkerNum"
                        :defaultValue="itemAddData.nursingWorkerNum"
                        placeholder="请选择要分配的志愿者">
                      <a-select-option v-for="m in  authUserIdOption" :key="m.value">{{m.text}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </div>
                <div class="a-form-model-item-view">
                  <a-form-model-item has-feedback class="a-form-model-item" ref="intakeTime" label="登记时间" prop="intakeTime">
                    <a-date-picker
                        v-model="itemAddData.intakeTime"
                        placeholder="请选择登记时间"
                        @change="onIntakeTimeChange"
                        @ok="onIntakeTimeOK" />
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
moment.locale('zh-cn')

const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 18 }
}
export default {
    name: 'ItemAdd',
    props: {
        addVisible: {
            default: false
        }
    },
    components:{
        Editor:Editor,
        moment:moment
    },
    data () {
        return {
            locale:locale,
            authUserIdOption:[

            ],
            allBedSketchOption:[],
            genderOption:this.$commonConstants.genderOption,
            submitUrl:'api/v1/oldSketch/addItem', //提交URL
            timeFormat:'YYYY-MM-DD', //时间格式
            beginAndEndTimeFormat:'YYYY-MM', //时间格式
            itemAddData: {

            },
            uploadUrl: process.env.BASE_API+'/api/systemFile/uploadFile', //文件时上传
            //校验规则
            validateRules: {
                realName: [
                    { required: true, message: '请规范填写姓名', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请规范填写性别', trigger: 'blur' }
                ],
                age: [
                    { required: true, message: '请规范填写年龄', trigger: 'blur' }
                ],
                bodyState: [
                    { required: true, message: '请规范填写身体状况', trigger: 'blur' }
                ],
                censusRegister: [
                    { required: true, message: '请规范填写户籍', trigger: 'blur' }
                ],
                idCardNum: [
                    { required: true, message: '请规范填写身份证号码', trigger: 'blur' }
                ],
                contacts: [
                    { required: true, message: '请规范填写联系人', trigger: 'blur' }
                ],
                contactsPhone: [
                    { required: true, message: '请规范填写联系人号码', trigger: 'blur' }
                ],
                homeAddress: [
                    { required: true, message: '请规范填写家庭住址', trigger: 'blur' }
                ],
                intakeTime: [
                    { required: true, message: '请选择登记时间', trigger: 'change' }
                ],
                dataType: [
                    {
                        type: 'array',
                        required: true,
                        message: 'Please select at least one activity type',
                        trigger: 'change',
                    },
                ],
                resource: [
                    { required: true, message: 'Please select activity resource', trigger: 'change' },
                ],
            },
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
            formItemLayout,
            validateStatus: '',
            help: '',
        }
    },
    methods: {
        handleGenderChange(value){
          this.itemAddData.gender = value
        },
        async setOtherData(){
          this.authUserIdOption = await this.$commonConstants.authUserRoleSketchOption('NURSING_STAFF')
        },
        onDischargedTimeChange(value, dateString){
          console.log('Selected Time: ', value);
          console.log('Formatted Selected Time: ', dateString);
          this.itemAddData.dischargedTime = dateString
        },
        onDischargedTimeOK(value){
          console.log('onOk: ', value);
        },
        onIntakeTimeChange(value, dateString){
          console.log('Selected Time: ', value);
          console.log('Formatted Selected Time: ', dateString);
          this.itemAddData.intakeTime = dateString
        },
        onIntakeTimeOK(value){
          console.log('onOk: ', value);
        },
        handleBedNumChange(value){
          this.itemAddData.bedNum = value
        },
        handleNursingWorkerNumChange(value){
          this.itemAddData.nursingWorkerNum = value
        },
        handleRegionChange(value){
            this.itemAddData.regionId = value
        },
        handleAuthUserChange(value){
            this.itemAddData.authUserId = value
        },
        onEndTimeChange(value, dateString){
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
            this.itemAddData.endTime = dateString
        },
        onBeginTimeChange(value, dateString){
            console.log('Selected Time: ', value);
            console.log('Formatted Selected Time: ', dateString);
            this.itemAddData.beginTime = dateString
        },
        onTimeOK(value){
            console.log('onOk: ', value);
        },
        moment, //时间处理
        handleCancel() {
            this.previewVisible = false;
        },
        //删除文件集合里面的文件
        removeFileFromList(arrayList,uid){
            if(arrayList && uid){
                let newArr = arrayList.reduce((total, current) => {
                    current.uid !== uid && total.push(current);
                    return total;
                }, []);
                return newArr;
            }
        },
        onClose () {
            this.resetForm()
            this.$emit('close')
        },
        clearAll(){
            console.log('clearAll')
            //清除所有文件内容
            this.authUserIdOption.splice(0,this.authUserIdOption.length);
            this.itemAddData = {}
        },
        validate(successStatus,object){
            console.log(successStatus)
            console.log(object)
        },
        handleCancelClick(){
            this.resetForm();
            this.clearAll();
            this.$emit("close")
        },
        resetForm() { //重置表单
            this.$refs.ruleForm.resetFields();
        },
        handleSubmit () { //处理提交
            let that = this
            that.$refs.ruleForm.validate(valid => {
                if (valid) {
                    //格式化时间
                    if(this.itemAddData.intakeTime){
                      this.itemAddData.intakeTime = moment(this.itemAddData.intakeTime).format(this.timeFormat);
                    }
                    if(this.itemAddData.dischargedTime){
                      this.itemAddData.dischargedTime = moment(this.itemAddData.dischargedTime).format(this.timeFormat);
                    }
                    this.loading = true
                    //从表单里面拿到值
                    this.$postBodyRequest(this.submitUrl, {
                        ...this.itemAddData
                    }).then((res) => {
                        let data = res.data
                        console.log(JSON.stringify(data))
                        if(data && data.code == 200){
                            this.loading = false
                            this.resetForm()
                            this.clearAll();
                            this.$emit('success')
                        }
                    }).catch((err) => {
                        this.$message.error('新增出现错误')
                        this.loading = false
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
    mounted () {

    },
    computed:{
        $video(){
            return this.$refs.vueMiniPlayer.$video;
        }
    },
    watch: {
        addVisible () {
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
