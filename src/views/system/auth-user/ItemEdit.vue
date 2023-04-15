<template>
  <a-modal  :width="1000"
            height="auto"
            :visible="editVisible" @cancel="handleCancelClick"
            cancelText="取消" okText="提交" @ok="handleSubmit">
    <a-form-model
            class="a-form-model"
            ref="ruleForm"
            :model="itemEditData"
            :rules="validateRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @validate="validate">
      <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="userName" label="登录账号" prop="userName">
          <a-input
                  placeholder="请输入登录账号"
                  v-model="itemEditData.userName"
                  @blur="
                     () => {
                       $refs.userName.onFieldBlur();
                     }"
          />
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="phoneNumber" label="手机号" prop="phoneNumber">
          <a-input
                  placeholder="请输入手机号"
                  v-model="itemEditData.phoneNumber"
                  @blur="
                     () => {
                       $refs.phoneNumber.onFieldBlur();
                     }"
          />
        </a-form-model-item>
    </div>
    <div class="a-form-model-item-view">
        <a-form-model-item has-feedback class="a-form-model-item" ref="authRoleId" label="角色" prop="authRoleId">
          <!--mode="multiple"-->
          <!--:allowClear="true"-->
          <a-select
                  style="width: 100%"
                  @change="handleAuthRoleChange"
                  v-model="itemEditData.authRoleId" :defaultValue="itemEditData.authRoleId" placeholder="请选择角色">
            <a-select-option v-for="m in  authAuthRoleOption" :key="m.value">{{m.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback class="a-form-model-item" ref="gender" label="性别" prop="gender">
          <a-select @change="handleGenderChange"
                    v-model="sketchData.gender"
                    :defaultValue="sketchData.gender"
                    placeholder="请选择性别">
            <a-select-option v-for="m in  genderOption" :key="m.value">{{m.text}}</a-select-option>
          </a-select>
        </a-form-model-item>
    </div>
    <div class="a-form-model-item-view">
      <a-form-model-item has-feedback class="a-form-model-item" ref="age" label="年龄" prop="age">
        <a-input
            placeholder="请输入年龄"
            v-model="sketchData.age"
            @blur="
                       () => {
                         $refs.age.onFieldBlur();
                       }"
        />
      </a-form-model-item>
      <a-form-model-item has-feedback class="a-form-model-item" ref="address" label="联系地址" prop="address">
        <a-textarea class="a-form-model-item-input"
                    v-model="sketchData.address"
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
                   v-model="itemEditData.realName"
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
import {mapState, mapMutations} from 'vuex'
import baseUtils from '@/utils/baseUtils'
import moment from 'moment'
import {genderOption} from '../../../utils/commonConstants'
moment.locale('en')
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 }
}
export default {
  name: 'ItemEdit',
  components:{
    baseUtils:baseUtils,
    moment:moment
  },
  props: {
    editVisible: {
      default: false
    },
    itemEditData: {
      required: true,
      default: {
        authUserId:'',
        userName: '',
        phoneNumber:'',
        realName:'',
        gender:'',
        address:'',
        age:'',
        authRoleId:'',
      }
    },
  },
  data () {
    return {
      sketchData:{
        authUserId:'',
        gender:'',
        address:'',
        age:'',
      },
      genderOption:this.$commonConstants.genderOption,
      sketchUrl:'api/v1/authUser/querySketchByUserId',
      submitUrl:'api/v1/authUser/updateItem', //提交URL
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
        gender:{ required: false, message: '请选择性别', trigger: 'change' },
        address: [
          { required: false,  message: '请输入联系地址', trigger: 'blur' },
        ],
        age: [
          { required: false,pattern: new RegExp(baseUtils.numberPattern(), "g") ,message: '请规范填写年龄', trigger: 'blur' }
        ],
        realName: [
          { required: true,  message: '请输入真实姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '真实姓名全称长度为1-10', trigger: 'blur' },
        ],
      },
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 15,
      },
      formItemLayout,
      authAuthRoleOption: [],
      authUserId: '',
      sex: '',
      status: '',
      loading: false
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.account.user
    })
  },
  created () {

  },
  methods: {
    async setOtherData(){
      this.authAuthRoleOption = await this.$commonConstants.authAuthRoleOption();
      let authUserId = this.itemEditData.authUserId
      this.$get(this.sketchUrl,
          {
            'authUserId':authUserId
          }
      ).then((r) => {
        let data = r.data.data;
        console.log("用户信息:"+JSON.stringify(data))
        if(data){
          this.sketchData = {...data}
        }
      })
      console.log('this.itemEditData:'+JSON.stringify(this.itemEditData))
    },
    handleGenderChange(value){
      this.itemEditData.gender = value
    },
    ...mapMutations({
      setUser: 'account/setUser'
    }),
    handleAuthRoleChange(value){
      this.itemEditData.authRoleId = value
    },
    onSetupTimeOK(value){
      console.log('onOk: ', value);
    },
    moment, //时间处理
    handleCancel() {
      this.previewVisible = false;
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
      this.authAuthRoleOption.splice(0,this.authAuthRoleOption.length);
    },
    //提交
    handleSubmit () {
      let that = this
      that.$refs.ruleForm.validate(valid => {
        console.log('开始验证')
        if (valid) {
          console.log('验证通过')
          this.loading = true
          let userName = this.itemEditData.userName;
          let gender = this.sketchData.gender;
          let address = this.sketchData.address;
          let age = this.sketchData.age;
          this.itemEditData.sketchData = {...this.sketchData}
          this.itemEditData.gender = gender
          this.itemEditData.address = address
          this.itemEditData.age = age
          //从表单里面拿到值
          this.$putBodyRequest(this.submitUrl, {
            ...this.itemEditData
          }).then(() => {
            this.loading = false
            this.resetForm()
            this.clearAll();
            this.reset()
            this.$emit('success')
            if (userName === this.currentUser.userName) {
              this.$get(`api/v1/authUser/${userName}`).then((r) => {
                this.setUser(r.data)
              })
            }
          }).catch((error) => {
            console.log(JSON.stringify(error))
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
  //监测editVisible值的变动
  watch: {
    editVisible () {
      if (this.editVisible) {
        this.setOtherData();
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~@/utils/utils.less";
</style>

