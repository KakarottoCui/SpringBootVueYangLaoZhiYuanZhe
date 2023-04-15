<template>
    <a-modal :width="1000" height="auto" :visible="editVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
        @ok="handleSubmit">
        <a-form-model class="a-form-model" ref="ruleForm" :model="itemEditData" :rules="validateRules"
            :label-col="labelCol" :wrapper-col="wrapperCol" @validate="validate">
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="oldSketchId" label="老人姓名"
                    prop="oldSketchId">
                    <a-select @change="handleOldSketchIdChange" v-model="itemEditData.oldSketchId"
                        :defaultValue="itemEditData.oldSketchId" placeholder="请选择老人姓名">
                        <a-select-option v-for="m in  allOldSketchOption" :key="m.value">{{m.text}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="serviceTemplateId" label="服务名称"
                    prop="serviceTemplateId">
                    <a-select @change="handleServiceSketchChange" v-model="itemEditData.serviceTemplateId"
                        :defaultValue="itemEditData.serviceTemplateId" placeholder="请选择服务名称">
                        <a-select-option v-for="m in  allServiceOption" :key="m.value">{{m.text}}</a-select-option>
                    </a-select>
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="startTime" label="服务开始时间"
                    prop="startTime">
                    <a-date-picker v-model="itemEditData.startTime" placeholder="请选择服务时间" @change="onstartTimeChange"
                         style="width: 100%;" format="YYYY-MM-DD HH:mm"
                        :show-time="{ defaultValue: moment('09:00', 'HH:mm') }" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="duration" label="服务时长（分）"
                    prop="duration">
                    <a-input-number placeholder="请输入服务时长" v-model="itemEditData.duration" @blur="
                         () => {
                           $refs.duration.onFieldBlur();
                         }" style="width: 100%;" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" label="备注">
                    <a-input placeholder="请输入备注" v-model="itemEditData.otherSketch" />
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
                authUserIdOption: [],
                allOldSketchOption: [],
                allServiceOption: [],
                submitUrl: 'api/v1/serviceRecord/updateItem', //提交URL
                timeFormat: 'YYYY-MM-DD', //时间格式
                beginAndEndTimeFormat: 'YYYY-MM', //时间格式
                uploadUrl: process.env.BASE_API + '/api/systemFile/uploadFile', //文件时上传
                //校验规则
                validateRules: {
                    oldSketchId: [{
                        required: true,
                        message: '请规范填写老人姓名',
                        trigger: 'change'
                    }],
                    serviceTemplateId: [{
                        required: true,
                        message: '请选择服务名称',
                        trigger: 'change'
                    }],
                    startTime: [{
                        required: true,
                        message: '请规范填写服务时间',
                        trigger: 'change'
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
            onstartTimeChange(value, dateString) {
                this.itemEditData.startTime = dateString
            },
            handleOldSketchIdChange(value) {
                this.itemEditData.oldSketchId = value
            },
            handleServiceSketchChange(value) {
                this.itemEditData.serviceTemplateId = value
            },
            async setOtherData() {
                this.allOldSketchOption = await this.$commonConstants.allOldSketchOption();
                this.allServiceOption = await this.$commonConstants.allServiceOption();
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
                        }*/
                        if (this.itemEditData.endTime) {
                            this.itemEditData.endTime = moment(this.itemEditData.endTime).format(this
                                .beginAndEndTimeFormat);
                        }
                        this.loading = true
                        //从表单里面拿到值
                        console.log(this.itemEditData);
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