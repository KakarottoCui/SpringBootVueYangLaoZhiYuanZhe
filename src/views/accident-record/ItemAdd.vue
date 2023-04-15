<template>
    <a-modal :width="1000" height="auto" :visible="addVisible" @cancel="handleCancelClick" cancelText="取消" okText="提交"
        @ok="handleSubmit">
        <a-form-model class="a-form-model" ref="ruleForm" :model="itemAddData" :rules="validateRules"
            :label-col="labelCol" :wrapper-col="wrapperCol" @validate="validate" layout="horizontal">
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="oldSketchId" label="老人姓名"
                    prop="oldSketchId">
                    <a-select @change="handleOldSketchIdChange" v-model="itemAddData.oldSketchId"
                        :defaultValue="itemAddData.oldSketchId" placeholder="请选择老人姓名">
                        <a-select-option v-for="m in  allOldSketchOption" :key="m.value">{{m.text}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="serviceTemplateId" label="服务名称"
                    prop="serviceTemplateId">
                    <a-select @change="handleServiceSketchChange" v-model="itemAddData.serviceTemplateId"
                        :defaultValue="itemAddData.serviceTemplateId" placeholder="请选择服务名称">
                        <a-select-option v-for="m in  allServiceOption" :key="m.value">{{m.text}}</a-select-option>
                    </a-select>
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" ref="startTime" label="服务开始时间"
                    prop="startTime">
                    <a-date-picker v-model="itemAddData.startTime" placeholder="请选择服务时间"
                        @ok="onstartTimeOK" style="width: 100%;" format="YYYY-MM-DD HH:mm" :show-time="{ defaultValue: moment('09:00', 'HH:mm') }" @change=" onStartTimeChange" />
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="duration" label="服务时长（分）"
                    prop="duration">
                    <a-input-number placeholder="请输入服务时长" v-model="itemAddData.duration" @blur="
                         () => {
                           $refs.duration.onFieldBlur();
                         }" style="width: 100%;" />
                </a-form-model-item>
            </div>
            <div class="a-form-model-item-view">
                <a-form-model-item has-feedback class="a-form-model-item" label="备注">
                    <a-input placeholder="请输入备注" v-model="itemAddData.otherSketch" />
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
            span: 8
        },
        wrapperCol: {
            span: 14
        },
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
                allOldSketchOption: [],
                allServiceOption: [],
                submitUrl: 'api/v1/serviceRecord/addItem', //提交URL
                timeFormat: 'YYYY-MM-DD', //时间格式
                beginAndEndTimeFormat: 'YYYY-MM', //时间格式
                itemAddData: {

                },
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
                        message: '请规范填写服务名称',
                        trigger: 'change'
                    }],
                    startTime: [{
                        required: true,
                        message: '请选择服务时间',
                        trigger: 'change'
                    }],
                    duration: [{
                        required: true,
                        message: '请规范填写服务时长',
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
            disabledDate(current) {
                return current && current < moment().endOf('day');
            },

            disabledDateTime() {
                return {
                    disabledHours: () => this.range(0, 24).splice(4, 20),
                    disabledMinutes: () => this.range(30, 60),
                    disabledSeconds: () => [55, 56],
                };
            },
            onStartTimeChange(value, dateString) {
                this.itemAddData.startTime = dateString
            },
            onstartTimeOK(value) {
                console.log('onOk: ', value);
            },
            handleOldSketchIdChange(value) {
                this.itemAddData.oldSketchId = value
            },
            handleServiceSketchChange(value) {
                this.itemAddData.serviceTemplateId = value
            },
            async setOtherData() {
                this.allOldSketchOption = await this.$commonConstants.allOldSketchOption();
                this.allServiceOption = await this.$commonConstants.allServiceOption()
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
                        }*/
                        if (this.itemAddData.endTime) {
                            this.itemAddData.endTime = moment(this.itemAddData.endTime).format(this
                                .beginAndEndTimeFormat);
                        }
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