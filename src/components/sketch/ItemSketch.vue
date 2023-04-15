<template>
    <a-modal  :width="800"
              height="auto" :visible="sketchVisible" @cancel="handleSketchCancel"
              cancelText="取消" okText="提交" @ok="handleSubmit">
        <a-form-model
                ref="dynamicForm"
                :model="dynamicForm"
                v-bind="formItemLayoutWithOutLabel">
            <a-form-model-item
                    v-for="(item, index) in dynamicForm.sketchList"
                    :key="item.id"
                    v-bind="index === 0 ? formItemLayout : {}"
                    :label="index === 0 ? '内容' : ''"
                    :prop="'sketchList.' + index + '.sketchContent'"
                    :rules="{
                    min:1,
                    max:6,
                    required: true,
                    message: '请规范填写简略信息内容(1-6位字符)',
                    trigger: 'blur',
            }"
            >
                <a-input
                        v-model="item.sketchContent"
                        placeholder="请输入简略信息"
                        style="width: 60%; margin-right: 8px"
                />
                <a-icon
                        v-if="dynamicForm.sketchList.length > 1"
                        class="dynamic-delete-button"
                        type="minus-circle-o"
                        :disabled="dynamicForm.sketchList.length === 1"
                        @click="removeDomain(item)"
                />
            </a-form-model-item>
            <a-form-model-item v-if="dynamicForm.sketchList.length <= 6" v-bind="formItemLayoutWithOutLabel">
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
            sketchVisible: {
                default: false
            },
            sketchList:{
                type:Array,
                default: () => {
                    return []
                }
            }
        },
        name:'ItemSketch',
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
                    sketchList: [],
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
                let index = this.dynamicForm.sketchList.indexOf(item);
                if (index !== -1) {
                    this.dynamicForm.sketchList.splice(index, 1);
                }
            },
            addDomain() {
                this.dynamicForm.sketchList.push({
                    sketchContent: '',
                    id: this.$randomString(),
                });
            },
            handleSubmit(){
                let data = this.dynamicForm.sketchList
                console.log('sketchList:'+JSON.stringify(data))
                this.$emit('handleSubmit',data)
                this.dynamicForm.sketchList.slice(0,this.dynamicForm.sketchList.length)
            }
        },
        watch: {
            sketchVisible(){
                if(this.sketchVisible){
                    console.log('sketchList:'+JSON.stringify(this.sketchList))
                    this.dynamicForm.sketchList = this.sketchList
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
