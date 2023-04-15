<template>
  <a-modal v-model="show" :centered="true" :keyboard="false" :footer="null" :width="1000" height="auto"
    @cancel="handleCancelClick">
    <a-descriptions title="老人信息详细信息" layout="vertical" :column="5" bordered>
      <a-descriptions-item v-if="particularsData.realName" label="姓名">
        {{particularsData.realName}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.gender==='man'" label="性别">
        男性
      </a-descriptions-item>
      <a-descriptions-item v-else-if="particularsData.gender==='woman'" label="性别">
        女性
      </a-descriptions-item>
      <a-descriptions-item v-else label="性别">
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.age" label="年龄">
        {{particularsData.age}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.bodyState" label="身体状况">
        {{particularsData.bodyState}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.censusRegister" label="户籍">
        {{particularsData.censusRegister}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.idCardNum" label="身份证号码">
        {{particularsData.idCardNum}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.contacts" label="联系人">
        {{particularsData.contacts}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.contactsPhone" label="联系人号码">
        {{particularsData.contactsPhone}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.homeAddress" label="家庭住址">
        {{particularsData.homeAddress}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.intakeTime" label="登记时间">
        {{particularsData.intakeTime}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.nursingWorkerNum" label="志愿者">
        {{handleTypeByValue(particularsData.nursingWorkerNum,authUserIdOption)}}
      </a-descriptions-item>
    </a-descriptions>
    <a-modal :visible="previewImageVisible" :footer="null" @cancel="handleImagePreviewCancel">
      <img alt="example" style="width: 100%" :src="previewImageUrl" />
    </a-modal>
  </a-modal>
</template>
<script>
  import baseUtils from '@/utils/baseUtils'
  export default {
    name: 'ItemParticulars',
    components: {
      baseUtils
    },
    data() {
      return {
        previewImageVisible: false,
        previewImageUrl: false,
        authUserIdOption: [],
        //goodsImageVisible: false, //预览图片的弹出框
        //goodsImageUrlList: [], //预览图片的URL
      }
    },
    props: {
      particularsVisible: { //是否可见
        require: true,
        default: false
      },
      particularsData: { //详情数据
        require: true
      }
    },
    computed: {
      show: {
        get: function () { //展示的时候调用
          return this.particularsVisible
        },
        set: function () {

        }
      },
    },
    methods: {
      async setOtherData() {
        this.authUserIdOption = await this.$commonConstants.authUserRoleSketchOption('NURSING_STAFF')
        console.log('this.particularsData:' + JSON.stringify(this.particularsData))
      },
      handleTypeByValue(value, optionList) {
        if (baseUtils.isNull(value)) {
          return '无'
        }
        if (!optionList || !optionList.length > 0) {
          return '';
        }
        let resultList =
          optionList.filter(item => item.value == value);
        console.log(JSON.stringify(resultList))
        if (resultList && resultList.length > 0) {
          return resultList[0].text;
        } else {
          return '无'
        }
      },
      handleImagePreviewCancel() {
        this.previewImageVisible = false
        this.previewImageUrl = ''
      },
      handleCancelClick() {
        this.$emit('close')
      },
      //打开通知栏
      openNotification(object) {
        const key = `open${Date.now()}`;
        this.$notification.open({
          message: '通知',
          description: object.profile,
          btn: h => {
            return h(
              'a-button', {
                props: {
                  type: 'primary',
                  size: 'small',
                },
                on: {
                  click: () => this.$notification.close(key),
                },
              },
              '好的',
            );
          },
          key,
          onClose: close,
        });
      }
    },
    watch: { //监控弹窗的变化
      particularsVisible() {
        this.setOtherData();
      }
    }
  }
</script>
<style lang="less" scoped>
  .title_text {
    white-space: normal;
    word-break: break-all;
    word-warp: break-word;
  }
</style>