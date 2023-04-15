<template>
  <a-modal  :width="1000"
            height="auto"
            :visible="addVisible" @cancel="handleCancelClick"
            cancelText="取消" okText="提交" @ok="handleSubmit">
    <a-form-model
            class="a-form-model"
            ref="ruleForm"
            :model="itemAddData"
            :rules="validateRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @validate="validate">
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="userName" label="登录账号" prop="userName">
          <a-input
                  placeholder="请输入登录账号"
                  v-model="itemAddData.userName"
                  @blur="handleUserNameBlur"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="phoneNumber" label="手机号" prop="phoneNumber">
          <a-input
                  placeholder="请输入手机号"
                  v-model="itemAddData.phoneNumber"
                  @blur="
                   () => {
                     $refs.phoneNumber.onFieldBlur();
                   }"
          />
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="authRoleId" label="角色" prop="authRoleId">
          <a-select
              @change="handleAuthRoleChange"
              v-model="itemAddData.authRoleId"
              :defaultValue="itemAddData.authRoleId"
              placeholder="请选择角色">
            <a-select-option v-for="m in  authAuthRoleOption" :key="m.value">{{m.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="gender" label="性别" prop="gender">
          <a-select @change="handleGenderChange"
                    v-model="itemAddData.gender"
                    :defaultValue="itemAddData.gender"
                    placeholder="请选择性别">
            <a-select-option v-for="m in  genderOption" :key="m.value">{{m.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="age" label="年龄" prop="age">
          <a-input
              placeholder="请输入年龄"
              v-model="itemAddData.age"
              @blur="
                       () => {
                         $refs.age.onFieldBlur();
                       }"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="address" label="联系地址" prop="address">
          <a-textarea class="a-form-model-item-input"
                      v-model="itemAddData.address"
                      @blur="
                        () => {
                          $refs.address.onFieldBlur();
                        }"
          />
        </a-form-model-item>
      </div>
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="realName" label="真实姓名" prop="realName">
          <a-input class="a-form-model-item-input"
                      v-model="itemAddData.realName"
                      @blur="
                        () => {
                          $refs.realName.onFieldBlur();
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
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'ItemAdd',
  components:{
    baseUtils,
    moment:moment
  },
  props: {
    addVisible: {
      default: false
    }
  },
  data () {
    return {
      genderOption:this.$commonConstants.genderOption,
      submitUrl:'api/v1/authUser/addAuthUser', //提交URL
      itemAddData: {
        authUserId:'',
        userName: '',
        phoneNumber:'',
        realName:'',
        gender:'',
        address:'',
        age:'',
        authRoleId:'',
        sketchData:{
          authUserId:'',
          gender:'',
          address:'',
          age:'',
        },
      },
      sketchData:{//简略信息
        authUserId:'',
        gender:'',
        address:'',
        age:'',
      },
      timeFormat:'YYYY-MM-DD', //时间格式
      //校验规则
      validateRules: {
        userName: [
          { required: true,  message: '请输入登录账号', trigger: 'blur' },
          { min: 1, max: 100, message: '登录账号全称长度为1-100', trigger: 'blur' },
        ],
        phoneNumber: [
          { required: true,  message: '请输入手机号', trigger: 'blur' },
          { min: 1, max: 11, message: '手机号全称长度为1-11', trigger: 'blur' },
          { pattern: '^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$', message: '请输入格式正确的手机号',trigger: 'blur'},
        ],
        authRoleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        sketchOtherId: [{ required: true, message: '请选择地区', trigger: 'change' }],
        gender:{ required: true, message: '请选择性别', trigger: 'change' },
        address: [
          { required: true,  message: '请输入联系地址', trigger: 'blur' },
        ],
        age: [
          { required: true,pattern: new RegExp(baseUtils.numberPattern(), "g") ,message: '请规范填写年龄', trigger: 'blur' }
        ],
        realName: [
          { required: true,  message: '请输入真实姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '真实姓名全称长度为1-10', trigger: 'blur' },
        ],
      },
      loading: false,
      authAuthRoleOption: [],
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 15,
      },
      formItemLayout,
      defaultPassword: '123456',
      form: this.$form.createForm(this),
      validateStatus: '',
      help: ''
    }
  },
  created () {

  },
  methods: {
    async setOtherData(){
      this.authAuthRoleOption = await this.$commonConstants.authAuthRoleOption();
      console.log('this.authAuthRoleOption:'+JSON.stringify(this.authAuthRoleOption))
    },
    handleGenderChange(value){
      this.itemAddData.sketchData.gender = value
      this.itemAddData.gender = value
    },
    handleAuthRoleChange(value){
      this.itemAddData.authRoleId = value
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
      this.loading = false;
      this.clearAll();
      this.$emit('close')
    },
    clearAll(){
      console.log('clearAll')
      this.itemAddData = {
        userName: '',
        phoneNumber:'',
        realName:'',
        gender:'',
        address:'',
        age:'',
        authRoleId:'',
        sketchData:{
          authUserId:'',
          gender:'',
          address:'',
          age:'',
        },
      }
      this.authAuthRoleOption.splice(0,this.authAuthRoleOption.length);
    },
    handleSubmit () { //处理提交
      let that = this
      that.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          let gender = this.itemAddData.gender;
          let address = this.itemAddData.address;
          let age = this.itemAddData.age;
          let authUserId = this.itemAddData.authUserId;
          this.itemAddData.sketchData = {
            authUserId:authUserId,
            gender:gender,
            address:address,
            age:age,
          }
          console.log('需要新增的信息:'+JSON.stringify(this.itemAddData))
          //从表单里面拿到值
          this.$postBodyRequest(this.submitUrl, {
            ...this.itemAddData
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
            this.$message.error('新增出现错误')
            this.loading = false
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleUserNameBlur () {
      let userName = this.itemAddData.userName.trim()
      if (userName.length) {
        if (userName.length > 100) {
          this.validateStatus = 'error'
          this.help = '登录账号不能超过100个字符'
        } else if (userName.length < 2) {
          this.validateStatus = 'error'
          this.help = '登录账号不能少于2个字符'
        } else {
          this.validateStatus = 'validating'
          this.$get(`api/v1/authUser/checkUserName?userName=`+userName).then((r) => {
            if (r.data) {
              this.validateStatus = 'success'
              this.help = ''
            } else {
              this.validateStatus = 'error'
              this.help = '抱歉，该登录账号已存在'
            }
          })
        }
      } else {
        this.validateStatus = 'error'
        this.help = '登录账号不能为空'
      }
    }
  },
  watch: {
    addVisible () {
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
