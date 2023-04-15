import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
import request from '@/utils/request'
import db from '@/utils/localstorage'
import baseUtils from '@/utils/baseUtils'
import commonConstants from '@/utils/commonConstants'
import validator from '@/utils/validator'
import corpMap from '@/utils/corpMap'
import chartColor from '@/utils/chartColor'
import 'ant-design-vue/dist/antd.css'
import '@/utils/install'
import vueMiniPlayer from 'vue-mini-player'
import 'vue-mini-player/lib/vue-mini-player.css'
import { pcaa } from 'area-data-vue';
import 'area-linkage-vue/dist/index.css';
import AreaLinkageVue from 'area-linkage-vue';
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(db)
Vue.use(vueMiniPlayer)
Vue.use(AreaLinkageVue)
Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
  }
})
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$putBodyRequest = request.putBodyRequest
Vue.prototype.$delete = request.delete
Vue.prototype.$export = request.export
Vue.prototype.$exportData = request.exportData
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$postFormRequest= request.postFormRequest
Vue.prototype.$postBodyRequest= request.postBodyRequest
Vue.prototype.$isNullOrEmptyArray= baseUtils.isNullOrEmptyArray
Vue.prototype.$isNull= baseUtils.isNull
Vue.prototype.$baseUtils= baseUtils
Vue.prototype.$handleTypeByValue= baseUtils.handleTypeByValue
Vue.prototype.$isNumberString= baseUtils.isNumberString
Vue.prototype.$isIdCardNumber= baseUtils.isIdCardNumber
Vue.prototype.$setPagination= baseUtils.setPagination
Vue.prototype.$setDataSource= baseUtils.setDataSource
Vue.prototype.$handleImageUrl= baseUtils.handleImageUrl
Vue.prototype.$randomString= baseUtils.randomString
Vue.prototype.$commonConstants= commonConstants
Vue.prototype.$validator= validator
Vue.prototype.$corpMap= corpMap
Vue.prototype.$chartColor= chartColor
Vue.prototype.$pcaa = pcaa;
Vue.prototype.$mainColor = 'rgb(42,132,255)'
Vue.prototype.$pageViewBgColor = '#f3f4f6'
Vue.prototype.$commonDark= '#000000' //普通黑色
Vue.prototype.$commonRed= '#ed3f14' //普通红色
Vue.prototype.$commonWhite= '#FFFFFF' //普通白色
Vue.prototype.$sketchColor= '#7D7D7D' //简略信息
Vue.prototype.$commonGreen= 'rgb(83,194,64)' //普通绿色
Vue.prototype.$successCode = '200'
//微信联系方式
Vue.prototype.weChatQRCodeUrl = 'https://singer-coder-public.oss-cn-chengdu.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E8%81%94%E7%B3%BB%E6%96%B9%E5%BC%8F.jpeg'
//微信收款码
Vue.prototype.weChatDonateQRCodeUrl = 'https://singer-coder-public.oss-cn-chengdu.aliyuncs.com/%E5%BE%AE%E4%BF%A1%E6%94%B6%E6%AC%BE%E4%BA%8C%E7%BB%B4%E7%A0%81.png'
//支付宝收钱码
Vue.prototype.aliPayDonateQRCodeUrl = 'https://singer-coder-public.oss-cn-chengdu.aliyuncs.com/%E6%94%AF%E4%BB%98%E5%AE%9D%E6%8D%90%E8%B5%A0.png'
//阿里巴巴开发手册
Vue.prototype.aliCodngGuideUrl = 'https://singer-coder-public.oss-cn-chengdu.aliyuncs.com/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C.png'
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#App')
