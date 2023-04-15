<template>
    <a-modal :width="1000" height="auto" :visible="addVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
        @ok="handleSubmit">
        <a-form-model class="a-form-model" ref="ruleForm" :model="itemAddData" :rules="validateRules"
            :label-col="labelCol" :wrapper-col="wrapperCol" @validate="validate">
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityName" label="活动名称"
                    prop="activityName">
                    <a-input placeholder="请输入活动名称" v-model="itemAddData.activityName" @blur="
                       () => {
                         $refs.activityName.onFieldBlur();
                       }" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityPlace" label="活动地点"
                    prop="activityPlace">
                    <a-input placeholder="请输入活动地点" v-model="itemAddData.activityPlace" @blur="
                       () => {
                         $refs.activityPlace.onFieldBlur();
                       }" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityNum" label="活动人数"
                    prop="activityNum">
                    <a-input-number placeholder="请输入活动人数" :defaultValue="0" :min="0" :max="100"
                        v-model="itemAddData.activityNum" @blur="
                       () => {
                         $refs.activityNum.onFieldBlur();
                       }" style="width:100%" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" label="备注">
                    <a-input placeholder="请输入备注" v-model="itemAddData.remark" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityStartTime" label="活动开始时间"
                    prop="activityStartTime">
                    <a-date-picker v-model="itemAddData.activityStartTime" placeholder="请选择开始时间" style="width: 100%;"
                        format="YYYY-MM-DD HH:mm" :show-time="{ defaultValue: moment('09:00', 'HH:mm') }"
                        @change="onStartTimeChange" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityEndTime" label="活动结束时间"
                    prop="activityEndTime">
                    <a-date-picker v-model="itemAddData.activityEndTime" placeholder="请选择活动结束时间" style="width: 100%;"
                        format="YYYY-MM-DD HH:mm" :show-time="{ defaultValue: moment('09:00', 'HH:mm') }"
                        @change="onEndTimeChange" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="activityContent" label="活动内容"
                    prop="activityContent">
                    <a-textarea :autosize="true" placeholder="请输入活动内容" v-model="itemAddData.activityContent" @blur="
                       () => {
                         $refs.activityContent.onFieldBlur();
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
                submitUrl: 'api/v1/activity/addItem', //提交URL
                timeFormat: 'YYYY-MM-DD', //时间格式
                beginAndEndTimeFormat: 'YYYY-MM', //时间格式
                itemAddData: {

                },
                uploadUrl: process.env.BASE_API + '/api/systemFile/uploadFile', //文件时上传
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
            onStartTimeChange(value, dateString) {
                this.itemAddData.activityStartTime = dateString
            },
            onEndTimeChange(value, dateString) {
                this.itemAddData.activityEndTime = dateString
            },
            async setOtherData() {

            },
            handleRegionChange(value) {
                this.itemAddData.regionId = value
            },
            handleAuthUserChange(value) {
                this.itemAddData.authUserId = value
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