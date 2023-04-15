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
              <a-form-model-item has-feedback class="a-form-model-item" ref="serviceName" label="服务名称" prop="serviceName">
                     <a-input placeholder="请输入服务名称" class="a-form-model-item-input" v-model="itemEditData.serviceName"
                        @blur="
                        () => {
                          $refs.serviceName.onFieldBlur();
                        }" />
              </a-form-model-item>
             <a-form-model-item has-feedback class="a-form-model-item" ref="serviceMoney" label="服务费用（元）"
                    prop="serviceMoney">
                    <a-input-number class="a-form-model-item-input" v-model="itemEditData.serviceMoney" @blur="
                        () => {
                          $refs.serviceMoney.onFieldBlur();
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
                authUserIdOption:[],
                submitUrl:'api/v1/templateService/updateItem', //提交URL
                timeFormat:'YYYY-MM-DD', //时间格式
                beginAndEndTimeFormat:'YYYY-MM', //时间格式
                uploadUrl: process.env.BASE_API+'/api/systemFile/uploadFile', //文件时上传
                //校验规则
                validateRules: {
                   serviceName: [{
                        required: true,
                        message: '请规范填写服务名称',
                        trigger: 'blur'
                    }],
                    serviceMoney: [{
                        required: false,
                        message: '请规范填写服务费用',
                        trigger: 'blur',
                        type: 'number'
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
            onOccurredTimeChange(value, dateString){
              console.log('Selected Time: ', value);
              console.log('Formatted Selected Time: ', dateString);
              this.itemEditData.occurredTime = dateString
            },
            onOccurredTimeOK(value){
              console.log('onOk: ', value);
            },
            handleOldSketchIdChange(value){
              this.itemAddData.oldSketchId = value
            },
            handleRegionChange(value){
                this.itemEditData.regionId = value
            },
            handleAuthUserChange(value){
                this.itemEditData.authUserId = value
            },
            onEndTimeChange(value, dateString){
                console.log('Selected Time: ', value);
                console.log('Formatted Selected Time: ', dateString);
                this.itemEditData.endTime = dateString
            },
            onBeginTimeChange(value, dateString){
                console.log('Selected Time: ', value);
                console.log('Formatted Selected Time: ', dateString);
                this.itemEditData.beginTime = dateString
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
                        }*/
                        if(this.itemEditData.endTime){
                          this.itemEditData.endTime = moment(this.itemEditData.endTime).format(this.beginAndEndTimeFormat);
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
