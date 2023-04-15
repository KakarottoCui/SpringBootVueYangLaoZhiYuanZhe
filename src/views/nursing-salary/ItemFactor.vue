<template>
  <div id="advanced-search-div">
    <a-form-model class="ant-advanced-search-form" ref="ruleForm" :model="queryParams" :rules="validateRules"
      :label-col="labelCol" :wrapper-col="wrapperCol" @validate="validate">
      <a-row :gutter="5">
        <a-col :span="12">
          <a-form-model-item has-feedback ref="mainInfo" label="主要工作内容" prop="mainInfo">
            <a-input placeholder="请输入主要工作内容" v-model="queryParams.mainInfo" @blur="
                         () => {
                           $refs.mainInfo.onFieldBlur();
                         }" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item has-feedback ref="type" label="兼职类型" prop="type">
            <a-select @change="handlePayStatusChange" v-model="queryParams.type" :defaultValue="queryParams.type"
              placeholder="请选择兼职类型">
              <a-select-option v-for="m in  payStatusOption" :key="m.value">{{m.text}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" :style="{ textAlign: 'right' }">
          <a-button type="primary" html-type="submit" @click="handleSearch">
            搜索
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="reset">
            重置
          </a-button>
          <a :style="{ marginLeft: '8px', fontSize: '12px' }" @click="toggleExpand">
            展开
            <a-icon :type="expandStatus ? 'up' : 'down'" />
          </a>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
  import moment from 'moment'
  moment.locale('zh-cn')
  import baseUtils from '@/utils/baseUtils'
  import locale from 'ant-design-vue/lib/date-picker/locale/zh_CN'
  import {
    payStatusOption
  } from '../../utils/commonConstants'
  export default {
    name: 'ItemFactor',
    components: {
      baseUtils: baseUtils,
      moment: moment,
    },
    data() {
      return {
        authUserIdOption: [],
        payStatusOption: this.$commonConstants.payStatusOption,
        locale: locale,
        dataBeginAndEndTimeFormat: this.$commonConstants.dataBeginAndEndTimeFormat,
        setupTimeFormat: 'YYYY-MM-DD',
        contrastParams: { //查询参数
          //对比查询条件
          contrastList: [],
        },
        queryParams: {
          mainInfo: '',
          type: '',
        },
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 15,
        },
        //是否展开
        expandStatus: false,
        //校验规则
        validateRules: {
          mainInfo: [{
            required: false,
            message: '请规范填写薪资',
            trigger: 'blur'
          }],
          type: [{
            required: false,
            message: '请规范填写兼职类型',
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
        }
      }
    },
    created() {
      this.setOtherData()
    },
    computed: {

    },
    methods: {
      handleAuthUserIdChange(value) {
        this.queryParams.authUserId = value
      },
      handlePayStatusChange(value) {
        this.queryParams.type = value
      },
      moment, //时间处理
      onTimeOK(value) {
        console.log('onOk: ', value);
      },
      onSetupEndTimeChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.queryParams.setupEndTime = dateString
      },
      onSetupBeginTimeChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.queryParams.setupBeginTime = dateString
      },
      onEndTimeChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.queryParams.endTime = dateString
      },
      onBeginTimeChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.queryParams.beginTime = dateString
      },
      initQueryParams() {
        //console.log('initQueryParams:this.queryParams开始 : '+JSON.stringify(this.queryParams))
        //把原来的固定的对比条件赋值给查询参数
        let contrastParams = this.contrastParams
        //清除对象
        Object.getOwnPropertyNames(contrastParams).forEach((item) => {
          let data = contrastParams[item]
          //console.log(item + ":contrastParams是否为数组"+Array.isArray(data))
          //如果为数组则清除数据
          if (Array.isArray(data)) {
            data.splice(0, data.length)
          }
          this.queryParams[item] = data
        })
        //清除原来的查询参数里面的数组信息和对象信息
        let queryParams = this.queryParams
        Object.getOwnPropertyNames(queryParams).forEach((item) => {
          let data = queryParams[item]
          //console.log(item + ":queryParams是否为数组"+Array.isArray(data))
          //console.log(item + " : 是否是字符串"+(baseUtils.isString(data)))
          //如果为数组则清除数据
          if (Array.isArray(data)) {
            data.splice(0, data.length)
            this.queryParams[item] = data
          } else if (baseUtils.isString(data)) {
            this.queryParams[item] = ""
          } else {
            this.queryParams[item] = {}
          }
        })
        //console.log('initQueryParams:this.queryParams结束 : '+JSON.stringify(this.queryParams))
      },
      handleCorpChange(value) {
        console.log(JSON.stringify(value))
        if (baseUtils.isNull(value)) {
          this.queryParams.corpBaseDataId = null;
          return;
        }
        let key = value.key;
        this.queryParams.corpBaseDataId = key
      },
      reset() {
        // 重置查询参数
        this.initQueryParams();
        this.$emit("reset")
      },
      handleSearch() {
        let queryParams = this.queryParams
        let dataBeginAndEndTimeFormat = this.dataBeginAndEndTimeFormat
        let setupTimeFormat = this.setupTimeFormat
        //格式化时间
        if (queryParams.beginTime) {
          queryParams.beginTime = moment(queryParams.beginTime).format(dataBeginAndEndTimeFormat);
        }
        if (queryParams.endTime) {
          queryParams.endTime = moment(queryParams.endTime).format(dataBeginAndEndTimeFormat);
        }
        this.$emit("handleSearch", queryParams)
      },
      //数字组合条件字段校验
      factorValidator(rule, value, callback) {
        /*console.log('rule : '+JSON.stringify(rule))
        console.log('value : '+JSON.stringify(value))*/
        //字段对比条件
        let contrastFactor = value.contrastFactor
        //字段对比值
        let contrastValue = value.contrastValue
        //当前操作的字段值
        let itemName = rule.fullField
        value.itemName = itemName
        if (baseUtils.isNull(contrastFactor) && !baseUtils.isNull(contrastValue)) {
          callback(new Error('条件和条件值同时必选择'))
        }
        if (!baseUtils.isNull(contrastFactor) && baseUtils.isNull(contrastValue)) {
          callback(new Error('条件和条件值同时必选择'))
        }
        if (!baseUtils.isNumberString(value.contrastValue)) {
          callback(new Error('请输入数字'))
        }
        let dataList = this.queryParams.contrastList
        let item = { //可以新增的条件参数
          itemName: itemName,
          contrastFactor: contrastFactor,
          contrastValue: contrastValue,
        }
        let handleResultList = this.$validator.factorContrastData(item, dataList);
        this.queryParams.contrastList = handleResultList
        console.log('this.queryParams : ' + JSON.stringify(this.queryParams))
        callback()
      },
      validate(successStatus, object) {
        console.log(successStatus)
        console.log(object)
      },
      //是否展开
      toggleExpand() {
        this.expandStatus = !this.expandStatus;
      },
      async setOtherData() {
        this.authUserIdOption = await this.$commonConstants.authUserRoleSketchOption('NURSING_STAFF')
        this.initQueryParams();
      },
    },
    watch: {

    }
  }
</script>
<style lang="less" scoped>
  @import "~@static/less/Common";
</style>