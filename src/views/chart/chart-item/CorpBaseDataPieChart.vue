<template>
    <div>
        <div id="chartSearchDiv" class="chartSearchDiv" style="height: 130px">
            <div class="chartText">各区县入驻企业分布柱状图</div>
            <a-row :gutter="1">
                <!--每一列占用8，超过24则换行-->
                <a-col
                        :labelCol="{span: 12}"
                        :wrapperCol="{span: 6}"
                        :span="12"
                        :style="{ display: 'block' }">
                    <div class="chartStatisticText">
                        <div>企业总数</div>
                        <div style="font-weight:bold;">{{totalCount}}家</div>
                    </div>
                </a-col>
                <a-col
                        :labelCol="{span: 12}"
                        :wrapperCol="{span: 6}"
                        :span="8"
                        :style="{ display: 'block' }">
                    <a-button
                            icon="search"
                            ghost
                            :loading="buttonLoading"
                            @click="refreshData">
                        刷新数据
                    </a-button>
                </a-col>
            </a-row>
        </div>
        <div id="mainCorpPieContainer" class="chartItem"></div>
    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import { Chart } from '@antv/g2';
  import moment from 'moment'
  moment.locale('zh-cn')
  import baseUtils from '@/utils/baseUtils'
  import locale from 'ant-design-vue/lib/date-picker/locale/zh_CN'
  export default {
    name: 'CorpBaseDataPieChart',
    components: {
      Chart:Chart,
      mapState:mapState,
      baseUtils:baseUtils,
      moment:moment,
    },
    data () {
      return {
        buttonLoading:false,
        totalCount:0,
        locale:locale,
        statisticsCountUrl:'api/v1/corpBaseData/countRegionCorp',
        chart:null,
        chartColor:this.$chartColor.chartColor,
        data:[

        ],
        queryParams: {
          endTime:'',
          beginTime:'',
        },
        //校验规则
        validateRules: {
          beginTime: [
            { required: false, message: '请选择数据开始时间', trigger: 'change' }
          ],
          endTime: [
            { required: false, message: '请选择数据结束时间', trigger: 'change' }
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
    mounted () {
      this.initChart()
    },
    created () {

    },
    destroyed () {

    },
    computed:{

    },
    methods: {
      refreshData(){
        this.statisticsCount();
      },
      moment, //时间处理
      onTimeOK(value){
        console.log('onOk: ', value);
      },
      async onEndTimeChange(value, dateString){
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.queryParams.endTime = dateString
        await this.statisticsCount();
      },
      async onBeginTimeChange(value, dateString){
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.queryParams.beginTime = dateString
        await this.statisticsCount();
      },
      validate(successStatus,object){
        console.log(successStatus)
        console.log(object)
      },
      async statisticsCount(){
        this.buttonLoading = true
        await this.$get(this.statisticsCountUrl,{
            ...this.queryParams
          }
        ).then((r) => {
          this.data.splice(0,this.data.length)
          let data = r.data.data;
          //console.log(JSON.stringify(data))
          if(data && data.countList){
            let countList = data.countList
            countList.map(item => {
              this.data.push(item)
            })
          }
          if(data && data.totalCount){
            this.totalCount = data.totalCount
          }
          //console.log('this.data : '+JSON.stringify(this.data))
          let chart = this.chart
          //console.log('chart : '+this.chart)
          if(chart){
            //立即改变数据
            chart.changeData(this.data);
          }
          this.buttonLoading = false
        })
      },
      async initChart() {
        await this.statisticsCount();
        let chart = new Chart({
          container: 'mainCorpPieContainer',
          autoFit: true,
          height: 350,
        });
        chart.coordinate('theta', {
          radius: 0.75,
        });
        //设置数据
        chart.data(this.data);
        chart.scale('count', {
          formatter: (val) => {
            val = val+'家';
            return val;
          },
        });
        chart.tooltip({
          showTitle: false,
          showMarkers: false,
        });
        chart
          .interval()
          .position('count')
          .color('regionName')
          .label('count', {
            content: (data) => {
              return `${data.regionName}: ${data.count}家`;
            },
          })
          .adjust('stack');
        chart.interaction('element-active');
        chart.interaction('element-single-selected');
        chart.theme(this.chartColor);
        chart.render();
        //console.log('this.data : '+JSON.stringify(this.data))
        this.chart = chart
        /*chart.scale('count', {
          formatter: (val) => {
            val = count + '家';
            return val;
          },
        });*/
        // 指定度量(或称 列定义）
        /*chart.scale({
          count: {
            alias: '数量' // 为属性定义别名
          },
          regionName: {
            alias: '地区名称' // 为属性定义别名
          },
        });*/

        /*chart
          .interval()
          .position('count')
          .color('regionName')
          .label('count', {
            content: (data) => {
              return `${data.regionName}: ${data.count }家`;
            },
          })
          .adjust('stack');
        chart.interaction('element-active');*/

      }
    }
  }
</script>

<style lang="less">
    @import "~@static/less/Chart";
    @import "~@static/less/Common";
</style>
