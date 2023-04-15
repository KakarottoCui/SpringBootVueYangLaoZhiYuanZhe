<template>
  <a-modal  :width="1000"
            height="auto"
            :visible="editVisible" @cancel="handleCancelClick"
            cancelText="取消" okText="提交" @ok="handleSubmit" @afterClose="afterClose">
    <a-form-model
            class="a-form-model"
            ref="ruleForm"
            :model="itemEditData"
            :rules="validateRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @validate="validate">
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="roleName" label="角色名称" prop="roleName">
          <a-input
                  placeholder="请输入角色名称"
                  v-model="itemEditData.roleName"
                  @blur="
                   () => {
                     $refs.roleName.onFieldBlur();
                   }"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="roleCode" label="角色代码" prop="roleCode">
          <!--<a-input
                  :disabled="true"
                  placeholder="请输入角色代码"
                  v-model="itemEditData.roleCode"
                  @blur="
                   () => {
                     $refs.roleCode.onFieldBlur();
                   }"
          />-->
          <a-input
                  placeholder="请输入角色代码"
                  v-model="itemEditData.roleCode"
                  @blur="
                   () => {
                     $refs.roleCode.onFieldBlur();
                   }"
          />
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="remark" label="角色描述" prop="remark">
          <a-textarea
                  class="a-form-model-item-input"
                  placeholder="请输入角色描述" v-model="itemEditData.remark"
                  @blur="
            () => {
              $refs.remark.onFieldBlur();
            }
          "  />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="authMenuIdList" label="权限选择" prop="authMenuIdList">
          <a-tree-select
                  v-model="authMenuIdList"
                  :defaultValue="authMenuIdList"
                  style="width: 100%"
                  allow-clear
                  multiple
                  :dropdown-style="{ maxHeight: '200px',placement:'bottomCenter', overflow: 'auto' }"
                  :tree-data="menuTreeData"
                  :tree-default-expand-all="false"
                  :max-tag-count="10"
                  size="small"
                  placeholder="请选择权限"
                  @change="onAuthMenuChange"
          >
          </a-tree-select>
        </a-form-model-item>
      </div>
      <!--<div class="a-form-model-item-view">
      </div>-->
    </a-form-model>
  </a-modal>
</template>
<script>
  import locale from 'ant-design-vue/lib/date-picker/locale/zh_CN'
  import Editor from '@/components/editor/Editor'
  import moment from 'moment'
  import { TreeSelect } from 'ant-design-vue';
  import baseUtils from '@/utils/baseUtils'
  moment.locale('zh-cn')
  export default {
    name: 'ItemEdit',
    props: {
      editVisible: {
        default: false
      },
      itemEditData: {
        roleName:'',
        roleCode:'',
        remark:'',
        optionalStatus:'',
      },
    },
    components:{
      Editor:Editor,
      moment:moment,
      baseUtils:baseUtils
    },
    data () {
      return {
        authMenuIdList:[], //角色 此处必须单独独立设置 否则修改的时候无法显示修改后的值
        optionalStatusOptions:[
          {
            'text':'是',
            'value':'01'
          },
          {
            'text':'否',
            'value':'02'
          },
        ],
        locale:locale,
        SHOW_STRATEGY:TreeSelect.SHOW_ALL,
        submitUrl:'api/v1/authRole/updateItem',
        validateRules:{
          roleName: [
            { required: false,  message: '请输入角色名称', trigger: 'blur' },
            { min: 1, max: 100, message: '角色名称长度为1-100', trigger: 'blur' },
          ],
          roleCode: [
            { required: false, message: '请规范填写角色代码', trigger: 'blur' },
          ],
          remark: [
            { required: true, message: '请规范填写角色描述', trigger: 'blur' }
          ],
          optionalStatus: [
            { required: true, message: '请选择是否可选', trigger: 'change' },
          ],
          authMenuIdList: [
            { validator: this.authMenuValidator ,trigger: 'change'},
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
        loading: false,
        menuTreeData: [],
        checkStrictly: true,
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 15,
        },
      }
    },
    methods: {
      //角色代码验证
      authMenuValidator(rule, value, callback){
        console.log('选择的值:'+value)
        if(!this.authMenuIdList.length > 0){
          callback(new Error('请选择权限'));
        }
        callback()
      },
      //角色代码验证
      roleCodeValidator(rule, value, callback){
        console.log('填写的值:'+value)
        if(baseUtils.isNull(value)) {
          callback(new Error('请选择数据'));
        }else{
          this.$get(`api/v1/authRole/roleCodeExisted`,{
            roleCode:value
          }).then((r) => {
            let result = r.data.data
            if (result) {
              callback(new Error('角色代码已经存在'));
            }else{
              callback()
            }
          })
        }
      },
      //角色名称验证
      roleNameValidator(rule, value, callback){
        console.log('填写的值:'+value)
        if(baseUtils.isNull(value)) {
          callback(new Error('请选择数据'));
        }else{
          this.$get(`api/v1/authRole/roleNameExisted`,{
            roleName:value
          }).then((r) => {
            let result = r.data.data
            if (result) {
              callback(new Error('角色名称已经存在'));
            }else{
              callback()
            }
          })
        }
      },
      handleOptionalStatusChange(value){
        console.log(value)
        console.log(JSON.stringify(value))
        this.itemEditData.optionalStatus = value
      },
      onAuthMenuChange(key) {
        console.log('触发onAuthMenuChange')
        console.log('key'+JSON.stringify(key))
        console.log('itemEditData.authMenuIdList'+JSON.stringify(this.authMenuIdList))
      },
      afterClose(){
        this.$emit("close")
      },
      handleCancelClick(){
        this.resetForm();
        this.clearAll();
        this.$emit("close")
      },
      clearAll(){
        this.menuTreeData.splice(0,this.menuTreeData.length)
        this.authMenuIdList.splice(0,this.authMenuIdList.length)
      },
      validate(successStatus,object){
        console.log(successStatus)
        console.log(object)
      },
      resetForm() { //重置表单
        this.$refs.ruleForm.resetFields();
      },
      onClose () {
        this.clearAll()
        this.resetForm()
        this.$emit('close')
      },
      handleSubmit () { //处理提交
        let that = this
        that.$refs.ruleForm.validate(valid => {
          if (valid) {
            //格式化时间
            this.loading = true
            //单独处理选择权限
            if(this.authMenuIdList.length > 0){
              this.itemEditData.authMenuIdList = this.authMenuIdList
            }
            //从表单里面拿到值
            this.$postBodyRequest(this.submitUrl, {
              ...this.itemEditData
            }).then((res) => {
              let data = res.data
              console.log(JSON.stringify(data))
              if(data && data.code == 200){
                this.loading = false
                this.resetForm()
                this.clearAll();
                this.$emit('success')
              }
            }).catch((err) => {
              this.$message.error('修改出现错误')
              this.loading = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
    watch: {
      editVisible () {
        if (this.editVisible) {
          //console.log(JSON.stringify(this.itemEditData))
          this.$postBodyRequest('api/v1/authMenu/queryAllAuthMenuTree',{
            needAll:true //查询所有菜单
          }).then((r) => {
            this.menuTreeData = r.data.data.children
          })
          this.$get('api/v1/authRole/queryMenuIdList',{
            authRoleId:this.itemEditData.authRoleId
          }).then((r) => {
            let data = r.data.data
            //console.log(JSON.stringify('查询角色对应的权限菜单返回: '+JSON.stringify(data)))
            if(data && data.length > 0){
              data.map(item => {
                this.authMenuIdList.push(item)
              })
              //console.log('this.itemEditData :' +JSON.stringify(this.itemEditData))
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  /*使用~@引入*/
  @import "~@/utils/utils.less";
</style>
