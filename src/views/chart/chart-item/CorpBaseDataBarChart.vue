<template>
    <div>
        <div id="chartSearchDiv" class="chartSearchDiv" style="height: 130px">
            <div class="chartText">各区县入驻企业分布柱状图</div>
            <!--<a-row :gutter="1">
                &lt;!&ndash;每一列占用8，超过24则换行&ndash;&gt;
                <a-col
                        :labelCol="{span: 12}"
                        :wrapperCol="{span: 6}"
                        :span="12"
                        :style="{ display: 'block' }">
                    <a-month-picker
                            :locale="locale"
                            v-model="queryParams.beginTime"
                            placeholder="请选择开始时间"
                            @change="onBeginTimeChange"
                            @ok="onTimeOK" />
                </a-col>
                <a-col
                        :labelCol="{span: 12}"
                        :wrapperCol="{span: 6}"
                        :span="12"
                        :style="{ display: 'block' }">
                    <a-month-picker
                            :locale="locale"
                            v-model="queryParams.endTime"
                            placeholder="请选择结束时间"
                            @change="onEndTimeChange"
                            @ok="onTimeOK" />
                </a-col>
            </a-row>-->
        </div>
        <div id="mainCorpContainer" class="chartItem"></div>
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
    name: 'CorpBaseDataBarChart',
    components: {
      Chart:Chart,
      mapState:mapState,
      baseUtils:baseUtils,
      moment:moment,
    },
    data () {
      return {
        locale:locale,
        statisticsCountUrl:'api/v1/corpBaseData/countRegionCorp',
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
        await this.$get(this.statisticsCountUrl,{
            ...this.queryParams
          }
        ).then((r) => {
          this.data.splice(0,this.data.length)
          let data = r.data.data;
          console.log(JSON.stringify(data))
          if(data && data.countList){
            let countList = data.countList
            countList.map(item => {
              this.data.push(item)
            })
          }
          console.log('this.data : '+JSON.stringify(this.data))
          let chart = this.chart
          console.log('chart : '+this.chart)
          if(chart){
            //立即改变数据
            chart.changeData(this.data);
          }
        })
      },
      async initChart() {
        await this.statisticsCount();
        let chart = new Chart({
          container: 'mainCorpContainer',
          autoFit: true,
          height: 350,
        });
        // 指定度量(或称 列定义）
        chart.scale({
          count: {
            alias: '数量' // 为属性定义别名
          },
          regionName: {
            alias: '地区名称' // 为属性定义别名
          },
        });
        chart.data(this.data);
        chart.tooltip({
          showMarkers: false,
        });
        chart.interval().position('regionName*count').tooltip('regionName*count');
        chart.interaction('element-active');
        chart.theme({
          "styleSheet":{
            "brandColor":"#5B8FF9",
            "paletteQualitative10":[
              "#5B8FF9",
              "#7346dd",
              "#53fd61",
              "#F6BD16",
              "#7262fd",
              "#78D3F8",
              "#9661BC",
              "#F6903D",
              "#008685",
              "#F08BB4"
            ],
            "paletteQualitative20":[
              "#5B8FF9",
              "#CDDDFD",
              "#61DDAA",
              "#CDF3E4",
              "#65789B",
              "#CED4DE",
              "#F6BD16",
              "#FCEBB9",
              "#7262fd",
              "#D3CEFD",
              "#78D3F8",
              "#D3EEF9",
              "#9661BC",
              "#DECFEA",
              "#F6903D",
              "#FFE0C7",
              "#008685",
              "#BBDEDE",
              "#F08BB4",
              "#FFE0ED"
            ]
          }
        });
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
