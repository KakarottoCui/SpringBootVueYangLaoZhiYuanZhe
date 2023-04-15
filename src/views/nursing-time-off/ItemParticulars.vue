<template>
  <a-modal v-model="show" :centered="true" :keyboard="false" :footer="null" :width="1000" height="auto"
    @cancel="handleCancelClick">
    <a-descriptions title="志愿者请假详细信息" layout="vertical" :column="5" bordered>
      <a-descriptions-item v-if="particularsData.authUserId" label="志愿者姓名">
        {{handleTypeByValue(particularsData.authUserId,authUserIdOption)}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.timeOffBegin" label="请假开始时间">
        {{particularsData.timeOffBegin}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.timeOffEnd" label="请假开始时间">
        {{particularsData.timeOffEnd}}
      </a-descriptions-item>
      <a-descriptions-item v-if="particularsData.timeOffRemark" label="请假缘由">
        {{particularsData.timeOffRemark}}
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
        authUserIdOption: [],
        previewImageVisible: false,
        previewImageUrl: false,
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