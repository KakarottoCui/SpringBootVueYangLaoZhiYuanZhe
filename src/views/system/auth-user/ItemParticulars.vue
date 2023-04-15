<template>
  <a-modal
    v-model="show"
    :centered="true"
    :keyboard="false"
    :footer="null"
    :width="750"
    @cancel="handleCancleClick"
    title="系统用户信息">
    <a-layout class="item-particulars">
      <a-layout-sider class="item-particulars-side">
        <a-avatar v-if="particularsData.avatar"  shape="square" :size="115" icon="user" :src="`static/avatar/${particularsData.avatar}`"/>
      </a-layout-sider>
      <a-layout-content class="item-content">
        <p><a-icon type="user"/>账户：{{particularsData.userName}}</p>
        <p :title="particularsData.roleName"><a-icon type="star"/>角色：{{particularsData.roleName? particularsData.roleName: '暂无角色'}}</p>
        <p><a-icon type="phone"/>电话：{{particularsData.phoneNumber ? particularsData.phoneNumber : '暂未绑定电话'}}</p>
      </a-layout-content>
      <a-layout-content class="item-content">
        <p><a-icon type="clock-circle"/>创建时间：{{particularsData.createTime}}</p>
        <p><a-icon type="login" />最近登录：{{particularsData.lastLoginTime}}</p>
        <p v-if="particularsData.description" :title="particularsData.description"><a-icon type="message"/>描述：{{particularsData.description}}</p>
      </a-layout-content>
    </a-layout>
  </a-modal>
</template>
<script>
  export default {
    name: 'ItemParticulars',
    props: {
      particularsVisible: {
        require: true,
        default: false
      },
      particularsData: {
        require: true
      }
    },
    computed: {
      show: {
        get: function () {
          return this.particularsVisible
        },
        set: function () {
        }
      },
      sex () {
        switch (this.particularsData.sex) {
          case 0:
            return '男'
          case 1:
            return '女'
          case 2:
            return '保密'
          default:
            return this.particularsData.sex
        }
      }
    },
    methods: {
      handleCancleClick () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less" scoped>
  /*webpack 会以~符号作为前缀的路径视为依赖模块去解析*/
  @import "~@static/less/ItemParticulars";
</style>
