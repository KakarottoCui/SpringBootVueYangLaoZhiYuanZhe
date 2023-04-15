<template>
    <div>
        <div id="chartSearchDiv" class="chartSearchDiv" style="height: 130px">
            <div class="chartText">各区县团组织统计</div>
            <a-row :gutter="1">
                <!--每一列占用8，超过24则换行-->
                <a-col
                    :labelCol="{span: 12}"
                    :wrapperCol="{span: 6}"
                    :span="8"
                    :style="{ display: 'block' }">
                    <div class="chartStatisticText">
                        <div>团组织总数</div>
                        <div style="font-weight:bold;">{{leagueTotalCount}}个</div>
                    </div>
                </a-col>
                <a-col
                    :labelCol="{span: 12}"
                    :wrapperCol="{span: 6}"
                    :span="8"
                    :style="{ display: 'block' }">
                    <div class="chartStatisticText">
                        <div>团员总数</div>
                        <div style="font-weight:bold;">{{youthLeagueMemberTotalCount}}名</div>
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
        <div id="regionLeagueContainer" class="chartItem"></div>
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
    name: 'CorpLeagueBarChart',
    components: {
      Chart:Chart,
      mapState:mapState,
      baseUtils:baseUtils,
      moment:moment,
    },
    data () {
      return {
        buttonLoading:false,
        leagueTotalCount:0, //团组织总数量
        youthLeagueMemberTotalCount:0, //团员总数量
        locale:locale,
        statisticsCountUrl:'api/v1/corpBaseData/statisticsCountRegionLeague',
        chart:null,
        data: [],
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
        await this.$postBodyRequest(this.statisticsCountUrl,{
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
          if(data && data.leagueTotalCount){
            this.leagueTotalCount = data.leagueTotalCount
          }
          if(data && data.youthLeagueMemberTotalCount){
            this.youthLeagueMemberTotalCount = data.youthLeagueMemberTotalCount
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
        //let chart = this.chart
        let chart = new Chart({
          container: 'regionLeagueContainer',
          autoFit: true,
          height: 350,
        });
        chart.data(this.data);
        chart.scale('regionName', {
          nice: true, //看起来更清晰
        });
        chart.tooltip({
          showMarkers: false,
          shared: true,
        });
        chart.legend({
          position: 'bottom', // 设置图例的显示位置
          itemGap: 20 // 图例项之间的间距
        });
        chart
          .interval()
          .position('regionName*dataValue')
          .color('dataType', [
            '#f92b29',
            '#1f75fd',
            '#53fd61',
            '#218fbb',
            '#00ccff',
            '#FF00FF',
            '#9932CC',
            '#07407b',
            '#e3770a',
            '#FFFF00',
            '#00FF7F',
            '#FFB6C1',
            '#2E8B57',
            '#FFD700',
          ])
          .adjust([
            {
              type: 'dodge',
              marginRatio: 0,
            },
          ]);
        chart.interaction('active-region');
        chart.render();
        this.chart = chart
      }
    }
  }
</script>

<style lang="less">
    @import "~@static/less/Chart";
    @import "~@static/less/Common";
</style>
