<template>
    <page-layout :title="title">
        <keep-alive v-if="multiPage">
          <router-view ref="page"/>
        </keep-alive>
        <router-view ref="page" v-else/>
    </page-layout>
</template>

<script>
import PageLayout from './PageLayout'
export default {
  name: 'PageView',
  components: {PageLayout},
  data () {
    return {
      title: ''
    }
  },
  computed: {
    multiPage () {
      return this.$store.state.setting.multiPage
    }
  },
  mounted () {
    this.getPageHeaderInfo()
  },
  updated () {
    this.getPageHeaderInfo()
  },
  methods: {
    getPageHeaderInfo () {
      this.title = this.$route.name
    }
  }
}
</script>

<style lang="less" scoped>
  .extraImg{
    margin-top: -60px;
    text-align: center;
    width: 195px;
    img{
      width: 100%;
    }
  }
</style>
