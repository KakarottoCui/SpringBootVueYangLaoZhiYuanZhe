<template>
    <a-modal  :width="1000"
              height="auto"
              :visible="auditVisible" @cancel="handleCancelClick"
              cancelText="取消" okText="提交" @ok="handleSubmit">
        <a-form-model
                class="a-form-model"
                ref="ruleForm"
                :model="itemAuditData"
                :rules="validateRules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                @validate="validate">
            <div class="a-form-model-item-view">
                <a-form-model-item class="a-form-model-item" label="审批操作" prop="auditStatus">
                    <a-radio-group
                            v-model="itemAuditData.auditStatus"
                            @change="onAuditStatusChange">
                        <a-radio :value="auditStatus.APPROVED">
                            通过
                        </a-radio>
                        <a-radio :value="auditStatus.REJECT">
                            驳回
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item has-feedback class="a-form-model-item" ref="auditRemark" label="审核备注" prop="auditRemark">
                    <a-textarea class="a-form-model-item-input"
                                v-model="itemAuditData.auditRemark"
                                @blur="
                        () => {
                          $refs.auditRemark.onFieldBlur();
                        }"
                    />
                </a-form-model-item>
            </div>
        </a-form-model>
    </a-modal>
</template>
<script>

  import baseUtils from '@/utils/baseUtils'
  import moment from 'moment'
  moment.locale('en')

  export default {
    name: 'ItemAudit',
    components: {
      moment:moment,
      baseUtils:baseUtils,
    },
    props: {
      auditVisible: {
        default: false
      },
      itemAuditData: {
        required: true,
        default: () => {
          return{
            auditType:'', //审核类型
            auditStatus:'', //审核状态
            itemId:'',//需要被处理的ID
          }
        }
      },
    },
    data () {
      return {
        auditStatus:{
          APPROVED:'APPROVED',
          REJECT:'REJECT',
          WAIT_HANDLE:'WAIT_HANDLE',
          ULTIMATE_APPROVED:'ULTIMATE_APPROVED',
          ULTIMATE_REJECT:'ULTIMATE_REJECT',
        },
        authUserIdOption:[ //当前系统里面的所有用户

        ],
        loading: false,
        //校验规则
        validateRules: {
          auditStatus: [
            { required: true, message: '请选择审核状态', trigger: 'change' }
          ],
          auditRemark: [
            { required: false,  message: '请输入审核备注', trigger: 'blur' },
            { min: 1, max: 100, message: '审核备注长度为1-100', trigger: 'blur' },
          ],
          authUserId: [
            { required: true, message: '请选择关联人员', trigger: 'change' }
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: 'Please select at least one activity type',
              trigger: 'change',
            },
          ],
        },
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 15,
        },
      }
    },
    methods: {
      onAuditStatusChange(e){ //处理审核状态选择
        console.log('radio checked', e.target.value);
        console.log('itemAuditData.auditStatus : '+this.itemAuditData.auditStatus);
      },
      onSetupTimeChange(value, dateString){ //生日选择的时候触发
        this.itemAuditData.setupTime = dateString
      },
      onSetupTimeOK(value){

      },
      moment, //时间处理
      validate(successStatus,object){
        console.log(successStatus)
        console.log(object)
      },
      resetForm() { //重置表单
        this.loading = false
        this.$refs.ruleForm.resetFields();
      },
      handleCancelClick(){
        this.clearAll();
        this.$emit("close")
      },
      onClose () {
        this.resetForm();
        //清除所有图片内容
        this.clearAll();
        this.$emit('close')
      },
      clearAll(){
        console.log('clearAll')
        this.authUserIdOption.splice(0,this.authUserIdOption.length);
      },
      handleSubmit () { //处理提交
        let that = this
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            //从表单里面拿到值
            this.$postBodyRequest('api/v1/auditProcess/handleProcess', {
              ...this.itemAuditData
            }).then(() => {
              this.loading = false
              this.resetForm()
              this.clearAll();
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
    updated(){

    },
    mounted () {

    },
    created () {

    },
    destroyed () {
    },
    computed:{

    },
    watch: { //监控弹窗的变化
      auditVisible () {
        if (this.auditVisible) {
          console.log('待审核的数据: '+JSON.stringify(this.itemAuditData))
        }
      }
    }
  }
</script>
<style lang="less" scoped>
    @import "~@/utils/utils.less";
</style>
