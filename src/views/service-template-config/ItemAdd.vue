<template>
    <a-modal :width="1200" height="auto" :visible="addVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
        @ok="handleSubmit">
        <a-form-model class="a-form-model" ref="ruleForm" :model="itemAddData" :rules="validateRules"
            :label-col="labelCol" :wrapper-col="wrapperCol" @validate="validate">
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="serviceName" label="服务名称"
                    prop="serviceName">
                    <a-input placeholder="请输入服务名称" class="a-form-model-item-input" v-model="itemAddData.serviceName"
                        @blur="
                        () => {
                          $refs.serviceName.onFieldBlur();
                        }" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="serviceMoney" label="服务费用（元）"
                    prop="serviceMoney">
                    <a-input-number style="width:100%" class="a-form-model-item-input" v-model="itemAddData.serviceMoney" @blur="
                        () => {
                          $refs.serviceMoney.onFieldBlur();
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
            moment: moment
        },
        data() {
            return {
                locale: locale,
                authUserIdOption: [ //当前系统里面的所有用户

                ],
                submitUrl: 'api/v1/templateService/addItem', //提交URL
                timeFormat: 'YYYY-MM-DD', //时间格式
                beginAndEndTimeFormat: 'YYYY-MM', //时间格式
                itemAddData: {

                },
                uploadUrl: process.env.BASE_API + '/api/systemFile/uploadFile', //文件时上传
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
        }
    }
</script>
<style lang="less" scoped>
    /*使用~@引入*/
    @import "~@/utils/utils.less";
</style>