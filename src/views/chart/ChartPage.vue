<template>
  <div id="mainDiv" class="mainDiv">
    <div class="chartItemGroup">
      <div class="mainChartItem">
        <CorpBaseDataPieChart></CorpBaseDataPieChart>
      </div>
      <div class="mainChartItem">
        <CorpReportBarChart></CorpReportBarChart>
      </div>
    </div>
    <div class="chartItemGroup">
      <div class="mainChartItem">
        <CorpPartyBarChart></CorpPartyBarChart>
      </div>
      <div class="mainChartItem">
        <CorpLeagueBarChart></CorpLeagueBarChart>
      </div>
    </div>
  </div>
</template>
<script>

import {mapState} from 'vuex'
import { Chart } from '@antv/g2';
import moment from 'moment'
import CorpReportBarChart from './chart-item/CorpReportBarChart'
import CorpBaseDataPieChart from './chart-item/CorpBaseDataPieChart'
import CorpPartyBarChart from './chart-item/CorpPartyBarChart'
import CorpLeagueBarChart from './chart-item/CorpLeagueBarChart'
import baseUtils from '@/utils/baseUtils'
moment.locale('zh-cn')

export default {
  name: 'MainPage',
  components: {
    Chart:Chart,
    mapState:mapState,
    baseUtils:baseUtils,
    CorpReportBarChart:CorpReportBarChart,
    CorpBaseDataPieChart:CorpBaseDataPieChart,
    CorpPartyBarChart:CorpPartyBarChart,
    CorpLeagueBarChart:CorpLeagueBarChart,
  },
  data () {
    return {
    }
  },
  mounted () {

  },
  created () {

  },
  destroyed () {

  },
  computed:{

  },
  methods: {

  }
}
</script>
<style lang="less">
  @import "~@static/less/Chart";
</style>
