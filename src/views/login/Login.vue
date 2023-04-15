<template>
  <div class="login">
    <a-form
            @submit.prevent="doLogin"
            :autoFormCreate="(form) => this.form = form">
      <a-tabs
              size="large"
              :tabBarStyle="{textAlign: 'center'}"
              style="padding: 0 2px"
              :activeKey="activeKey"
              @change="handleTabsChange">
        <!--<a-tab-pane tab="账户密码登录" key="1">-->
        <a-tab-pane key="1">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
                   style="margin-bottom: 24px;"></a-alert>
          <p class="loginText">账户密码登录</p>
          <a-form-item
            fieldDecoratorId="userName"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入账户名', whitespace: true}]}">
            <a-input size="large">
              <a-icon slot="prefix" type="user"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item
            fieldDecoratorId="password"
            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码', whitespace: true}]}">
            <a-input size="large" type="password">
              <a-icon slot="prefix" type="lock"></a-icon>
            </a-input>
          </a-form-item>
        </a-tab-pane>
        <!--<a-tab-pane tab="手机号登录" key="2">
          <a-form-item>
            <a-input size="large">
              <a-icon slot="prefix" type="phoneNumber"></a-icon>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-row :gutter="8" style="margin: 0 -4px">
              <a-col :span="16">
                <a-input size="large">
                  <a-icon slot="prefix" type="mail"></a-icon>
                </a-input>
              </a-col>
              <a-col :span="8" style="padding-left: 4px">
                <a-button style="width: 100%" class="captcha-button" size="large" @click="getCaptcha">查询验证码</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-tab-pane>-->
      </a-tabs>
      <a-form-item>
        <a-button :loading="loading" style="width: 100%; margin-top: 4px" size="large" htmlType="submit" type="primary">
          登录
        </a-button>
      </a-form-item>
      <div>
        <!--<a style="float: right" @click="regist">注册账户</a>-->
      </div>
    </a-form>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      loginData:{
        userName:'',
        password:'',
      },
      loading: false,
      error: '',
      activeKey: '1',
      authLoginUrl: '/api/v1/authUser/authUserLogin',
      validateRules:{
        userName: [
          { required: true,  message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 100, message: '用户名长度为1-100', trigger: 'blur' },
        ],
        password: [
          { required: true,  message: '请输入密码', trigger: 'blur' },
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
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    },
    copyright () {
      return this.$store.state.setting.copyright
    }
  },
  created () {
    this.$db.clear()
    this.$router.options.routes = []
  },
  methods: {
    validate(successStatus,object){
      console.log(successStatus)
      console.log(object)
    },
    async doLogin () {
      if (this.activeKey === '1') {
        // 用户名密码登录
        this.form.validateFields(['userName', 'password'], (errors, values) => {
          if (!errors) {
            this.loading = true
            let userName = this.form.getFieldValue('userName')
            let password = this.form.getFieldValue('password')
            this.$postBodyRequest(this.authLoginUrl, {
              userName: userName,
              password: password
            }).then(async (r) => {
              let data = r.data.data
              console.log('登录返回的数据:data:'+JSON.stringify(data))
              await this.saveLoginData(data) //保存登陆之后的数据
              setTimeout(() => {
                this.loading = false
              }, 1500)
              this.$router.push('/')
            }).catch((e) => {
              setTimeout(() => {
                console.log(e)
                this.loading = false
              }, 1500)
            })
          }
        })
      }
      if (this.activeKey === '2') {
        // 手机验证码登录
        this.$message.warning('暂未开发')
      }
    },
    regist () {
      this.$emit('regist', 'Regist')
    },
    getCaptcha () {
      this.$message.warning('暂未开发')
    },
    handleTabsChange (val) {
      this.activeKey = val
    },
    ...mapMutations({
      setToken: 'account/setToken',
      setExpireTime: 'account/setExpireTime',
      setPermissions: 'account/setPermissions',
      setRoles: 'account/setRoles',
      setUser: 'account/setUser',
      setSketch: 'account/setSketch',
      setTheme: 'setting/setTheme',
      setLayout: 'setting/setLayout',
      setMultiPage: 'setting/setMultiPage',
      fixSideBar: 'setting/fixSideBar',
      fixHeader: 'setting/fixHeader',
      setColor: 'setting/setColor'
    }),
    async saveLoginData (data) {
      this.setToken(data.token)
      this.setExpireTime(data.expireTime)
      this.setUser(data.user)
      this.setSketch(data.sketch)
      this.setPermissions(data.permissions)
      this.setRoles(data.roles)
      this.setTheme(data.config.theme)
      this.setLayout(data.config.layout)
      this.setMultiPage(data.config.multiPage === '1')
      this.fixSideBar(data.config.fixSideBar === '1')
      this.fixHeader(data.config.fixHeader === '1')
      this.setColor(data.config.color)
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    .loginText{
      text-align: center;
      font-weight:bold;
      font-size: 23px;
      color: #1890ff;
    }
    .icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
  }
</style>
