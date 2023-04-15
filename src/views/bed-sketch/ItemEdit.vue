<template>
    <a-modal  :width="1000"
              height="auto"
              :visible="editVisible" @cancel="handleCancelClick"
              cancelText="取消" okText="提交" @ok="handleSubmit">
        <a-form-model
                class="a-form-model"
                ref="ruleForm"
                :model="itemEditData"
                :rules="validateRules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @validate="validate">
                <div class="a-form-model-item-view">
                  <a-form-model-item has-feedback class="a-form-model-item" ref="activityName" label="活动名称" prop="activityName">
                      <a-input
                              placeholder="请输入活动名称"
                              v-model="itemEditData.activityName"
                              @blur="
                       () => {
                         $refs.activityName.onFieldBlur();
                       }"
                      />
                  </a-form-model-item>
                  <a-form-model-item has-feedback class="a-form-model-item" ref="activityPlace" label="活动地点"
                    prop="activityPlace">
                    <a-input placeholder="请输入活动地点" v-model="itemEditData.activityPlace" @blur="
                       () => {
                         $refs.activityPlace.onFieldBlur();
                       }" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityNum" label="活动人数"
                    prop="activityNum">
                    <a-input-number placeholder="请输入活动人数" :defaultValue="0" :min="0" :max="100"
                        v-model="itemEditData.activityNum" @blur="
                       () => {
                         $refs.activityNum.onFieldBlur();
                       }" style="width:100%" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" label="备注">
                    <a-input placeholder="请输入备注" v-model="itemEditData.remark" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityStartTime" label="活动开始时间"
                    prop="activityStartTime">
                    <a-date-picker v-model="itemEditData.activityStartTime" placeholder="请选择开始时间" style="width: 100%;"
                        format="YYYY-MM-DD HH:mm" :show-time="{ defaultValue: moment('09:00', 'HH:mm') }"
                        @change="onStartTimeChange" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityEndTime" label="活动结束时间"
                    prop="activityEndTime">
                    <a-date-picker v-model="itemEditData.activityEndTime" placeholder="请选择活动结束时间" style="width: 100%;"
                        format="YYYY-MM-DD HH:mm" :show-time="{ defaultValue: moment('09:00', 'HH:mm') }"
                        @change="onEndTimeChange" />
                </a-form-model-item>
            </div>
             <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityContent" label="活动内容"
                    prop="activityContent">
                    <a-textarea :autosize="true" placeholder="请输入活动内容" v-model="itemEditData.activityContent" @blur="
                       () => {
                         $refs.activityContent.onFieldBlur();
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
    moment.locale('zh-cn')

    const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 }
    }
    export default {
        name: 'ItemEdit',
        components: {
            Editor:Editor,
            moment:moment
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
        data () {
            return {
                locale:locale,
                authUserIdOption:[ //当前系统里面的所有用户

                ],
                corpRegionOption:[

                ],
                submitUrl:'api/v1/activity/updateItem', //提交URL
                timeFormat:'YYYY-MM-DD', //时间格式
                beginAndEndTimeFormat:'YYYY-MM', //时间格式
                uploadUrl: process.env.BASE_API+'/api/systemFile/uploadFile', //文件时上传
                //校验规则
                validateRules: {
                    activityName: [{
                        required: true,
                        message: '请规范填写活动名称',
                        trigger: 'blur'
                    }],
                    remark: [{
                        required: false,
                        message: '请规范填写备注',
                        trigger: 'blur'
                    }],
                    activityContent: [{
                        required: true,
                        message: '请规范填写活动内容',
                        trigger: 'blur'
                    }],
                    activityStartTime: [{
                        required: true,
                        message: '请选择登记时间',
                        trigger: 'change'
                    }],
                    activityEndTime: [{
                        required: true,
                        message: '请选择登记时间',
                        trigger: 'change'
                    }],
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

            },
            handleRegionChange(value){
                this.itemEditData.regionId = value
            },
            handleAuthUserChange(value){
                this.itemEditData.authUserId = value
            },
            onEndTimeChange(value, dateString){
                this.itemEditData.activityEndTime = dateString
            },
            onStartTimeChange(value, dateString){
                this.itemEditData.activityStartTime = dateString
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
            editVisible () {
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
