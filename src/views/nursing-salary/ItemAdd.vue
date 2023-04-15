<template>
    <a-modal :width="1000" height="auto" :visible="addVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
        @ok="handleSubmit">
        <a-form-model class="a-form-model" ref="ruleForm" :model="itemAddData" :rules="validateRules"
            :label-col="labelCol" :wrapper-col="wrapperCol" @validate="validate">
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="mainInfo" label="主要工作内容" prop="mainInfo">
                    <a-input placeholder="请输入主要工作内容" v-model="itemAddData.mainInfo" @blur="
                         () => {
                           $refs.mainInfo.onFieldBlur();
                         }" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="serviceTime" label="服务时间"
                    prop="serviceTime">
                    <a-input placeholder="请输入服务时间" v-model="itemAddData.serviceTime" @blur="
                         () => {
                           $refs.serviceTime.onFieldBlur();
                         }" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="num" label="招募人数" prop="num">
                    <a-input-number :min="1" style="width:100%" placeholder="请输入招募人数" v-model="itemAddData.num" @blur="
                       () => {
                         $refs.num.onFieldBlur();
                       }" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="type" label="兼职类型" prop="type">
                    <a-select @change="handlePayStatusChange" v-model="itemAddData.type"
                        :defaultValue="itemAddData.type" placeholder="请选择兼职类型">
                        <a-select-option v-for="m in  payStatusOption" :key="m.value">{{m.text}}</a-select-option>
                    </a-select>
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="phone" label="联系方式" prop="phone">
                    <a-input placeholder="请输入联系方式" v-model="itemAddData.phone" @blur="
                       () => {
                         $refs.phone.onFieldBlur();
                       }" />
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
                payStatusOption: this.$commonConstants.payStatusOption,
                submitUrl: 'api/v1/volunteerInfo/addItem', //提交URL
                timeFormat: 'YYYY-MM-DD', //时间格式
                beginAndEndTimeFormat: 'YYYY-MM', //时间格式
                itemAddData: {

                },
                uploadUrl: process.env.BASE_API + '/api/systemFile/uploadFile', //文件时上传
                //校验规则
                validateRules: {
                    mainInfo: [{
                        required: true,
                        message: '请规范填写主要工作内容',
                        trigger: 'blur'
                    }],
                    num: [{
                        required: true,
                        pattern: new RegExp(baseUtils.numberPattern(), "g"),
                        message: '请规范填写招募人数',
                        trigger: 'blur'
                    }],
                    type: [{
                        required: true,
                        message: '请规范选择兼职状态',
                        trigger: 'change'
                    }],
                    phone: [{
                        required: true,
                        pattern: new RegExp(baseUtils.numberPattern(), "g"),
                        message: '请规范填写联系方式',
                        trigger: 'blur'
                    }],
                    serviceTime: [{
                        required: true,
                        message: '请规范填写服务时间',
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
            handlePayStatusChange(value) {
                this.itemAddData.payStatus = value
            },
            handleNursingWorkerChange(value) {
                this.itemAddData.authUserId = value
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
        mounted() {

        },
        computed: {
            $video() {
                return this.$refs.vueMiniPlayer.$video;
            }
        },
        watch: {
        }
    }
</script>
<style lang="less" scoped>
    /*使用~@引入*/
    @import "~@/utils/utils.less";
</style>