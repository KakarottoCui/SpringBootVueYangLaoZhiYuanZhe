<template>
    <a-modal  :width="800"
              height="auto" :visible="tagVisible" @cancel="handleSketchCancel"
              cancelText="取消" okText="提交" @ok="handleSubmit">
        <a-form-model
                ref="dynamicForm"
                :model="dynamicForm"
                v-bind="formItemLayoutWithOutLabel">
            <a-form-model-item
                    v-for="(item, index) in dynamicForm.tagList"
                    :key="item.id"
                    v-bind="index === 0 ? formItemLayout : {}"
                    :label="index === 0 ? '内容' : ''"
                    :prop="'tagList.' + index + '.tagContent'"
                    :rules="{
                    min:1,
                    max:6,
                    required: true,
                    message: '请规范填写标签信息内容(1-6位字符)',
                    trigger: 'blur',
            }"
            >
                <a-input
                        v-model="item.tagContent"
                        placeholder="请输入标签信息"
                        style="width: 60%; margin-right: 8px"
                />
                <a-icon
                        v-if="dynamicForm.tagList.length > 1"
                        class="dynamic-delete-button"
                        type="minus-circle-o"
                        :disabled="dynamicForm.tagList.length === 1"
                        @click="removeDomain(item)"
                />
            </a-form-model-item>
            <a-form-model-item v-if="dynamicForm.tagList.length <= 6" v-bind="formItemLayoutWithOutLabel">
                <a-button type="dashed" style="width: 60%" @click="addDomain">
                    <a-icon type="plus" />新增
                </a-button>
            </a-form-model-item>
            <!--<a-form-model-item v-bind="formItemLayoutWithOutLabel">
                <a-button type="primary" html-type="submit" @click="submitForm('dynamicForm')">
                    提交
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm('dynamicForm')">
                    重置
                </a-button>
            </a-form-model-item>-->
        </a-form-model>
    </a-modal>
</template>

<script>
    export default {
        props:{
            tagVisible: {
                default: false
            },
            tagList:{
                type:Array,
                default: () => {
                    return []
                }
            }
        },
        name:'ItemTag',
        data() {
            return {
                formItemLayout:{
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 4 },
                    },
                    wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 20 },
                    },
                },
                formItemLayoutWithOutLabel:{
                    wrapperCol: {
                        xs: { span: 24, offset: 0 },
                        sm: { span: 20, offset: 4 },
                    },
                },
                dynamicForm: {
                    tagList: [],
                },
            };
        },
        methods: {
            handleSketchCancel(){
                this.clearAll();
                this.$emit("close")
            },
            clearAll(){

            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            removeDomain(item) {
                let index = this.dynamicForm.tagList.indexOf(item);
                if (index !== -1) {
                    this.dynamicForm.tagList.splice(index, 1);
                }
            },
            addDomain() {
                this.dynamicForm.tagList.push({
                    tagContent: '',
                    id: this.$randomString(),
                });
            },
            handleSubmit(){
                let data = this.dynamicForm.tagList
                console.log('tagList:'+JSON.stringify(data))
                this.$emit('handleSubmit',data)
                this.dynamicForm.tagList.splice(0,this.dynamicForm.tagList.length)
            }
        },
        watch: {
            tagVisible(){
                if(this.tagVisible){
                    console.log('tagList:'+JSON.stringify(this.tagList))
                    this.dynamicForm.tagList = this.tagList
                }
            }
        }
    };
</script>
<style>
    .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
    }
    .dynamic-delete-button:hover {
        color: #777;
    }
    .dynamic-delete-button[disabled] {
        cursor: not-allowed;
        opacity: 0.5;
    }
</style>
