<template>
  <div class="user-layout-register">
    <a-form ref="formRegister" :autoFormCreate="(form)=>{this.form = form}" id="formRegister">
      <a-form-item
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入注册账号' },  { validator: this.handleUsernameCheck }], validateTrigger: ['change', 'blur']}">
        <a-input size="large" type="text" v-model="userName" placeholder="账号"></a-input>
      </a-form-item>
      <a-form-item
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择角色' },  { validator: this.handleRoleCheck }], validateTrigger: ['change', 'blur']}">
        <a-select
                labelInValue
                :allowClear="true"
                placeholder="请选择角色"
                @change="handleRoleSelectChange"
        >
          <a-select-option v-for="m in roleOption" :key="m.value">{{m.text}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }">
            <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
            <div style="margin-top: 10px;">
              <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
            </div>
          </div>
        </template>
        <a-form-item
          fieldDecoratorId="password"
          :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}">
          <a-input size="large" v-model="password" type="password" @click="handlePasswordInputClick" autocomplete="false"
                   placeholder="至少6位密码"></a-input>
        </a-form-item>
      </a-popover>

      <a-form-item
        fieldDecoratorId="password2"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}">

        <a-input size="large" type="password" autocomplete="false" placeholder="确认密码"></a-input>
      </a-form-item>

      <a-form-item
              :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入社区' }], validateTrigger: ['change', 'blur']}">
        <a-input size="large" type="text" v-model="community" placeholder="社区"></a-input>
      </a-form-item>

      <!--
      <a-form-item
        fieldDecoratorId="phoneNumber"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }">
        <a-input size="large" placeholder="11 位手机号">
          <a-select slot="addonBefore" size="large" defaultValue="+86">
            <a-select-option value="+86">+86</a-select-option>
            <a-select-option value="+87">+87</a-select-option>
          </a-select>
        </a-input>
      </a-form-item>
      <a-input-group size="large" compact>
            <a-select style="width: 20%" size="large" defaultValue="+86">
              <a-select-option value="+86">+86</a-select-option>
              <a-select-option value="+87">+87</a-select-option>
            </a-select>
            <a-input style="width: 80%" size="large" placeholder="11 位手机号"></a-input>
          </a-input-group>

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item
            fieldDecoratorId="captcha"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}">
            <a-input size="large" type="text" placeholder="验证码">
              <a-icon slot="prefix" type='mail' :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            class="getCaptcha"
            size="large"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '查询验证码'||(state.time+' s')"></a-button>
        </a-col>
      </a-row>
-->
      <a-form-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn">立即注册
        </a-button>
        <a class="login" @click="returnLogin">使用已有账户登录</a>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
import enquireScreen from "../../utils/device";
import baseUtils from '@/utils/baseUtils'

const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
export default {
  name: 'Regist',
  components: {},
  data () {
    return {
      form: null,
      community: '',
      userName: '',
      password: '',
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      },
      registerBtn: false,
      roleOption:[ //角色选项

      ],
      authRoleId:'', //角色ID
    }
  },
  computed: {
    passwordLevelClass () {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName () {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor () {
      return levelColor[this.state.passwordLevel]
    }
  },
  created () { //创建完成后调用
    //查询留言详情信息
    this.$get('/api/v1/authUser/queryAllAuthRole',
            {

            }
    ).then((r) => {
      let data = r.data.data;
      if(data){
        data.map(item => {
          let option = {
            'text':item.roleName,
            'value':item.authRoleId
          }
          this.roleOption.push(option);
        })
      }
    })
  },
  methods: {
    handleRoleSelectChange(value){
      if(baseUtils.isNull(value)){
        this.authRoleId = ''; //如果不选择的话是需要清除查询条件的的
        return;
      }
      this.authRoleId = value.key;
    },
    isMobile () {
      return this.$store.state.setting.isMobile
    },
    handlePasswordLevel (rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },

    handlePasswordCheck (rule, value, callback) {
      let password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },

    handleRoleCheck (rule, value, callback) {
      let authRoleId = this.authRoleId.trim()
      if(baseUtils.isNull(authRoleId)){
          callback(new Error('角色必选'))
      }
    },
    handleUsernameCheck (rule, value, callback) {
      let userName = this.userName.trim()
      if (userName.length) {
        if (userName.length > 10) {
          callback(new Error('用户名不能超过10个字符'))
        } else if (userName.length < 4) {
          callback(new Error('用户名不能少于4个字符'))
        } else {
          this.$get(`api/v1/authUser/checkUserName?userName=`+userName).then((r) => {
            let data = r.data
            if (data && data.code == '200') {
              callback()
            } else {
              this.validateStatus = 'error'
              callback(new Error('抱歉，该用户名已存在'))
            }
          })
        }
      } else {
        callback()
      }
    },

    // handlePhoneCheck (rule, value, callback) {
    //   callback()
    // },

    handlePasswordInputClick () {
      if (!this.isMobile()) {
        this.state.passwordLevelChecked = true
        return
      }
      this.state.passwordLevelChecked = false
    },

    handleSubmit () {
      this.form.validateFields((err, values) => {
        console.log(JSON.stringify(err))
        if (!err) {
          this.$postBodyRequest('/api/v1/authUser/register', {
            community: this.community,
            userName: this.userName,
            password: this.password,
            authRoleId: this.authRoleId
          }).then(() => {
            this.$message.success('注册成功')
            this.returnLogin()
          }).catch(() => {
            this.$message.error('抱歉，注册账号失败')
          })
        }
      })
    },
    // getCaptcha (e) {
    //   e.preventDefault()
    //   let that = this
    //
    //   this.form.validateFields(['phoneNumber'], {force: true},
    //     (err, values) => {
    //       if (!err) {
    //         this.state.smsSendBtn = true
    //
    //         let interval = window.setInterval(() => {
    //           if (that.state.time-- <= 0) {
    //             that.state.time = 60
    //             that.state.smsSendBtn = false
    //             window.clearInterval(interval)
    //           }
    //         }, 1000)
    //       }
    //     }
    //   )
    // },
    returnLogin () {
      this.$emit('regist', 'Login')
    }
  }
}
</script>
<style lang="less">
  .user-register {
    &.error {
      color: #ff0000;
    }
    &.warning {
      color: #ff7e05;
    }
    &.success {
      color: #52c41a;
    }
  }
  .user-layout-register {
    .ant-input-group-addon {
      &:first-child {
        background-color: #fff;
      }
    }
    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }
    .register-button {
      width: 50%;
    }
    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>
